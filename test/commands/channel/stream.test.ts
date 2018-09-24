import { expect, test } from '@salesforce/command/dist/test';
import { StreamingClient, StreamingConnectionState } from '@salesforce/core';
import { testSetup } from '@salesforce/core/lib/testSetup';

const $$ = testSetup();

describe('channel:stream', () => {
  test
    .withOrg({ username: 'test@org.com' }, true)
    .do(ctx => {
      $$.SANDBOX.stub(StreamingClient, 'init').callsFake(async options => {
        return {
          handshake: async () => StreamingConnectionState.CONNECTED,
          subscribe: async () => options.streamProcessor({payload: { Message__c: 'test message'}, event: {replayId: 20}})
        };
      });
    })
    .stdout()
    .command(['channel:stream', '/event/test', '--targetusername', 'test@org.com'])
    .it('runs channel:stream /event/test --targetusername test@org.com', ctx => {
      expect(ctx.stdout).to.contain('test message');
    });

  let calledReplay = false;
  test
    .withOrg({ username: 'test@org.com' }, true)
    .do(ctx => {
      $$.SANDBOX.stub(StreamingClient, 'init').callsFake(async options => {
        return {
          handshake: async () => StreamingConnectionState.CONNECTED,
          subscribe: async () => options.streamProcessor({payload: { Message__c: 'test message'}, event: {replayId: 20}}),
          replay: () => calledReplay = true
        };
      });
    })
    .stdout()
    .command(['channel:stream', '/event/test', '--targetusername', 'test@org.com', '--replayid', '20'])
    .it('runs channel:stream /event/test --targetusername test@org.com -r 20', ctx => {
      expect(ctx.stdout).to.contain('test message');
      // Make sure replay was called on the client
      expect(calledReplay).to.equal(true);
    });
});
