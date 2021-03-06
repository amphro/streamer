[![CircleCI](https://circleci.com/gh/amphro/streamer/tree/master.svg?style=shield)](https://circleci.com/gh/amphro/streamer/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/@amphro/streamer.svg)](https://npmjs.org/package/@amphro/streamer)

streamer
==============

Stream platform or streaming events to the console via a channel.

This plugin was build as part of a Dreamforce'18 talk. Here are the [slides](https://github.com/amphro/streamer/blob/master/Build_and_Release_a_CLI_Plugin_LIVE!.pdf) and the [recording](https://www.youtube.com/watch?v=CnNxghMVW7c).



<!-- toc -->

<!-- tocstop -->

<!-- install -->
```sh-session
$ sfdx plugin:install @amphro/streamer
$ sfdx COMMAND
running command...
$ sfdx channel --help
USAGE
  $ sfdx COMMAND
...
```
<!-- commands -->
* [`sfdx channel:stream [CHANNEL]`](#sfdx-channelstream-channel)

## `sfdx channel:stream [CHANNEL]`

stream platform or streaming events to the console via a channel

```
USAGE
  $ sfdx channel:stream [CHANNEL]

OPTIONS
  -r, --replayid=replayid                         a replayId to replay events from
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx channel:stream /event/MyEvent__e -u de -r 20
```

_See code: [src/commands/channel/stream.ts](https://github.com/amphro/streamer/blob/v1.0.1/src/commands/channel/stream.ts)_
<!-- commandsstop -->
