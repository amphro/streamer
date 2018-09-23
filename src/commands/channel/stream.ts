import {core, flags, SfdxCommand} from '@salesforce/command';
import { DefaultStreamingOptions, StatusResult, StreamingClient } from '@salesforce/core';
import {AnyJson, ensureJsonMap, JsonMap} from '@salesforce/ts-types';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('@amphro/streamer', 'channel');

export class EventTail extends SfdxCommand {

  public static description = messages.getMessage('stream.commandDescription');

  public static examples = [messages.getMessage('stream.example1')];

  public static args = [{name: 'channel', require}];

  protected static flagsConfig = {
    replayid: flags.integer({char: 'r', description: messages.getMessage('stream.replayIdFlagDescription'), default: 20})
  };

  protected static requiresUsername = true;

  public async run(): Promise<AnyJson> {
    await this.steamEvent();
    return {};
  }

  public async getClient(channel, streamProcessor) {
    const options = new DefaultStreamingOptions(this.org, channel, streamProcessor);
    return await StreamingClient.init(options);
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

    const asyncStatusClient = await this.getClient(channel, streamProcessor);

    if (this.flags.replayid > 0) {
        asyncStatusClient.replay(this.flags.replayid);
    }

    await asyncStatusClient.handshake();
    this.ux.log('Listening... (ctrl-c to exit)');
    await asyncStatusClient.subscribe(async () => {});
  }
}
