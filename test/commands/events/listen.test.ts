import { expect, test } from '@salesforce/command/dist/test';
import { EventTail } from '../../../src/commands/events/listen'
import { StreamingConnectionState } from '@salesforce/core'

describe('hello:org', () => {
  test
    .withOrg({ username: 'test@org.com' }, true)
    .stub(EventTail.prototype, 'getClient', (channel, streamProcessor) => {
      return {
        handshake: async () => {
          StreamingConnectionState.CONNECTED
        },
        subscribe: async () => {
          streamProcessor({payload: { Message__c: 'test message'}, event: {replayId: 20}})
        }
      }
    })
    .stdout()
    .command(['events:listen', '--targetusername', 'test@org.com'])
    .it('runs events:listen --targetusername test@org.com', ctx => {
      expect(ctx.stdout).to.contain('20: test message');
    });
});
