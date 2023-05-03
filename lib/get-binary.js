const os = require("os");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const Downloader = require("nodejs-file-downloader");
const { sync: deleteDir } = require("rimraf");
const decompress = require("decompress");
const decompressTarGz = require("decompress-targz");

const SUPPORTED_PLATFORMS = {
  "darwin-x64": "darwin_amd64",
  "linux-x64": "linux_amd64",
  "linux-arm64": "linux_arm64v8",
  "linux-arm": "linux_armv7",
  "win32-x64": "windows_amd64",
};

const _p = os.platform();
const _a = os.arch();
const platform = _p + "-" + _a;

if (!Object.keys(SUPPORTED_PLATFORMS).includes(platform)) {
  throw "Unsupported platform/architecture: " + platform;
}

const _dp = SUPPORTED_PLATFORMS[platform];
const BIN_DIR = path.join(path.dirname(__dirname), "bin");
const lastestVersionsUrl =
  "https://api.github.com/repos/aler9/mediamtx/releases/99623433";

if (!fs.existsSync(BIN_DIR)) {
  deleteDir(BIN_DIR, { preserveRoot: true });
  fs.mkdirSync(BIN_DIR, { recursive: true });
}

axios
  .get(lastestVersionsUrl)
  .then(async ({ data: { tag_name: version, assets } }) => {
    const { name, browser_download_url: url } = assets
      .filter(({ name }) => {
        return (
          (name.endsWith(".tar.gz") || name.endsWith(".zip")) &&
          name.indexOf(_dp) > 0
        );
      })
      .pop();

    const fileName = name.replace(/^.*(tar\.gz|zip)$/gim, `${platform}.$1`);
    const compressedPath = path.join(BIN_DIR, fileName);
    const versionPath = path.join(BIN_DIR, "VERSION");
    if (!fs.existsSync(compressedPath)) {
      const _d = new Downloader({
        url: url,
        directory: BIN_DIR,
        fileName,
        cloneFiles: false,
      });
      await _d.download();
    }

    if (!fs.existsSync(BIN_DIR)) {
      deleteDir(BIN_DIR, { preserveRoot: true });
      fs.mkdirSync(BIN_DIR, { recursive: true });
    }

    fs.writeFileSync(versionPath, version.replace(/[^\d\.]+/gim, ""), "utf8");
    await decompress(compressedPath, BIN_DIR, {
      ...(fileName.endsWith(".zip") ? {} : { plugins: [decompressTarGz()] }),
      filter: (file) => path.basename(file.path).startsWith("mediamtx"),
    });

    fs.unlinkSync(compressedPath);
  });
