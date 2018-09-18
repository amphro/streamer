import {core, flags, SfdxCommand} from '@salesforce/command';
import { DefaultStreamingOptions, StatusResult, StreamingClient, StreamingOptions } from '@salesforce/core';
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
        if (rawPayload.Message__c) {
            this.ux.log(rawPayload.Message__c);
        }

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

    const asyncStatusClient: StreamingClient<string> = await StreamingClient.init(options);
    await asyncStatusClient.handshake();
    this.ux.log('Handshake successful');
    if (this.flags.number) {
        asyncStatusClient['cometClient'].addExtension({
            outgoing: message => {
                if (message.channel === '/meta/subscribe') {
                    if (!message.ext) { message.ext = {}; }
                    const replayFromMap = {};
                    replayFromMap[this.args.eventName] = -2;
                    // add "ext : { "replay" : { CHANNEL : REPLAY_VALUE }}" to subscribe message
                    message.ext['replay'] = replayFromMap;
                }
            }
        });
    }
    await asyncStatusClient.subscribe();
    this.ux.log('Listening...');
  }
}
