"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const _p = os.platform();
const _a = os.arch();
const platform = _p + "-" + _a;

const SUPPORTED_PLATFORMS = [
  "darwin-x64",
  "linux-x64",
  "linux-arm64",
  "linux-arm",
  "win32-x64",
];

if (!SUPPORTED_PLATFORMS.includes(platform))
  throw "Unsupported platform/architecture: " + platform;

const BIN_DIR = path.join(__dirname, "bin");
const binary = `mediamtx${_p === "win32" ? ".exe" : ""}`;

/**
 * @type {{
 *  path: string;
 *  version: string;
 * }}
 */
module.exports = {
  version: fs.readFileSync(path.join(BIN_DIR, "VERSION"), "utf8").trim(),
  path: path.join(BIN_DIR, binary),
};
