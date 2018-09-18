platformevents
==============

Listen to platform events

[![Version](https://img.shields.io/npm/v/platformevents.svg)](https://npmjs.org/package/platformevents)
[![CircleCI](https://circleci.com/gh/amphro/platformevents/tree/master.svg?style=shield)](https://circleci.com/gh/amphro/platformevents/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/amphro/platformevents?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/platformevents/branch/master)
[![Codecov](https://codecov.io/gh/amphro/platformevents/branch/master/graph/badge.svg)](https://codecov.io/gh/amphro/platformevents)
[![Greenkeeper](https://badges.greenkeeper.io/amphro/platformevents.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/amphro/platformevents/badge.svg)](https://snyk.io/test/github/amphro/platformevents)
[![Downloads/week](https://img.shields.io/npm/dw/platformevents.svg)](https://npmjs.org/package/platformevents)
[![License](https://img.shields.io/npm/l/platformevents.svg)](https://github.com/amphro/platformevents/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g event-listener
$ event-listener COMMAND
running command...
$ event-listener (-v|--version|version)
event-listener/0.0.0 darwin-x64 node-v9.4.0
$ event-listener --help [COMMAND]
USAGE
  $ event-listener COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`event-listener events:listen [EVENTNAME]`](#event-listener-eventslisten-eventname)

## `event-listener events:listen [EVENTNAME]`

A plugin to retrieve and monitor platform events created by the Hashtag Listener(s)

```
USAGE
  $ event-listener events:listen [EVENTNAME]

OPTIONS
  -r, --replayid=replayid                         [default: 20] Retrieve the last n number of events
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation
```

_See code: [src/commands/events/listen.ts](https://github.com/amphro/event-listener/blob/v0.0.0/src/commands/events/listen.ts)_
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
