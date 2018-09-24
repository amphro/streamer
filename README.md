streamer
==============

Stream platform or streaming events to the console via a channel.

[![CircleCI](https://circleci.com/gh/amphro/platformevents/tree/master.svg?style=shield)](https://circleci.com/gh/amphro/platformevents/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/platformevents.svg)](https://npmjs.org/package/platformevents)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g @amphro/streamer
$ @amphro/streamer COMMAND
running command...
$ @amphro/streamer (-v|--version|version)
@amphro/streamer/0.0.0 darwin-x64 node-v10.10.0
$ @amphro/streamer --help [COMMAND]
USAGE
  $ @amphro/streamer COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`@amphro/streamer channel:stream [CHANNEL]`](#amphro-streamer-channelstream-channel)

## `@amphro/streamer channel:stream [CHANNEL]`

stream platform or streaming events to the console via a channel

```
USAGE
  $ @amphro/streamer channel:stream [CHANNEL]

OPTIONS
  -r, --replayid=replayid                         a replayId to replay events from
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx channel:stream /event/MyEvent__e -u de -r 20
```

_See code: [src/commands/channel/stream.ts](https://github.com/amphro/streamer/blob/v0.0.0/src/commands/channel/stream.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
