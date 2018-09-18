import {core, flags, SfdxCommand} from '@salesforce/command';
import { DefaultStreamingOptions, SfdxError, StatusResult, StreamingClient, StreamingOptions } from '@salesforce/core';
import {AnyJson, asAnyJson, asJsonMap, ensureJsonMap, ensureNumber, ensureString, JsonMap} from '@salesforce/ts-types';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('platformevents', 'events');

export default class EventTail extends SfdxCommand {

  public static description = messages.getMessage('tail.commandDescription');

  public static examples = [

  ];

  public static args = [{name: 'eventName', require}];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    force: flags.string({char: 'f', description: messages.getMessage('tail.forceFlagDescription')})
    // number: flags.boolean({char: 'n', description: messages.getMessage('tail.numberFlagDescription')})
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  public async run(): Promise<AnyJson> {
    const name = this.flags.eventName;

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();

    await this.steamEvent();

    return { };
  }

  private async steamEvent() {
    this.ux.log(this.org.getConnection().getApiVersion());
    const streamProcessor = (message: JsonMap): StatusResult<string> => {
        const rawPayload = ensureJsonMap(message.payload);
        if (!rawPayload.id) {
            throw new SfdxError('Not found.', 'NotFound');
        }
        this.ux.log(rawPayload);

        return {
            completed: true,
            payload: ensureString(rawPayload.id)
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
