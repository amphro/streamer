import {core, flags, SfdxCommand} from '@salesforce/command';
import { DefaultStreamingOptions, SfdxError, StatusResult, StreamingClient, StreamingOptions, CometClient } from '@salesforce/core';
import {AnyJson, ensureJsonMap, ensureString, JsonMap} from '@salesforce/ts-types';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('event-listener', 'events');

export default class EventTail extends SfdxCommand {

  public static description = messages.getMessage('tail.commandDescription');

  public static examples = [

  ];

  public static args = [{name: 'eventName', require}];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    force: flags.boolean({char: 'f', description: messages.getMessage('tail.forceFlagDescription')}),
    number: flags.integer({char: 'n', description: messages.getMessage('tail.numberFlagDescription')})
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  public async run(): Promise<AnyJson> {
    // const name = this.flags.eventName;

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    // const conn = this.org.getConnection();

    await this.steamEvent();

    return { };
  }

  private async steamEvent() {
    this.ux.log(this.org.getConnection().getApiVersion());
    const streamProcessor = (message: JsonMap): StatusResult<string> => {
        console.log(message);
        // Looks like:
        // { schema: '2-WbrEYaxZwZWJVS5I0l9Q',
//   payload: 
//   { CreatedDate: '2018-09-18T16:57:58.149Z',
//     CreatedById: '005j000000BXWfbAAH',
//     Message__c: '#SalesforceDX stuff' },
//  event: { replayId: 26 } }
        const rawPayload = ensureJsonMap(message.payload);
        if (!rawPayload['Message__c']) {
            throw new SfdxError('Not found.', 'NotFound');
        }
        this.ux.log(rawPayload);

        return {
            completed: !this.flags.force,
            payload: ensureString(rawPayload['Message__c'])
        };
    };

    const options: StreamingOptions<string> =
        new DefaultStreamingOptions(
            this.org,
            this.args.eventName,
            streamProcessor);

    try {
        const asyncStatusClient: StreamingClient<string> = await StreamingClient.init(options);
        await asyncStatusClient.handshake();
        this.ux.log('Handshake successful');
        if (this.flags.number) {
            // do something with replay ids
            // CometClient
            // cometdReplayExtension https://github.com/developerforce/StreamingReplayClientExtensions/blob/master/javascript/cometdReplayExtension.js
        }
        await asyncStatusClient.subscribe(async () => {
            this.ux.log('Before sub');
        });
        this.ux.log('After sub successful');
    } catch (e) {
        this.ux.error(e);
        throw e;
    }
  }
}
