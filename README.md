# mediamtx installer

Platform independent binary installer of [mediamtx](https://github.com/aler9/mediamtx) for node projects. Useful for tools that should "just work" on multiple environments.

Installs a binary of `mediamtx` for the current platform and provides a path and version. Supports Linux, Windows and Mac OS/X.

A combination of package.json fields `supportedPlatforms`, `cpu`, and `os` let's the installer only download the binary for the current platform. See also "Warnings during install", below.

## Install

    npm install --save mediamtx-installer

## Usage examples

```javascript
const mediamtx = require('mediamtx-installer');
console.log(mediamtx.path, mediamtx.version);
```

### [process.spawn()](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)

```javascript
const mediamtxPath = require('mediamtx-installer').path;
const spawn = require('child_process').spawn;
const mediamtx = spawn(mediamtxPath, args);
mediamtx.on('exit', onExit);
```