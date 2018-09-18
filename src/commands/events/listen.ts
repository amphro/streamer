import {core, flags, SfdxCommand} from '@salesforce/command';
import { DefaultStreamingOptions, StatusResult, StreamingClient, StreamingOptions } from '@salesforce/core';
import {AnyJson, ensureJsonMap, JsonMap} from '@salesforce/ts-types';

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
    replayid: flags.integer({char: 'r', description: messages.getMessage('tail.numberFlagDescription'), default: 20})
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  public async run(): Promise<AnyJson> {
    await this.steamEvent();

    return { };
  }

  private async steamEvent() {
    const channel = this.args.eventName;
    this.ux.log(this.org.getConnection().getApiVersion());

    const streamProcessor = (message: JsonMap): StatusResult<string> => {
        const event = ensureJsonMap(message.event);
        const payload = ensureJsonMap(message.payload);
        this.ux.log(`${event.replayId}: ${payload.Message__c}`);
        return { completed: false };
    };

    const options: StreamingOptions<string> =
        new DefaultStreamingOptions(
            this.org,
            channel,
            streamProcessor);

    const asyncStatusClient: StreamingClient<string> = await StreamingClient.init(options);

    if (this.flags.replayid > 0) {
        asyncStatusClient.replay(this.flags.replayid);
    }
    await asyncStatusClient.handshake();
    this.ux.log('Listening...');
    await asyncStatusClient.subscribe(async () => {});
  }
}
