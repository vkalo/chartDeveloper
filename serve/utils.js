var { statSync, existsSync, readdirSync, unlinkSync, rmdirSync } = require('fs');
const { } = require("path");

function fileIsExist(path) {
  try {
    file = statSync(path);
    return true;
  } catch (e) {
    log.err('source not found', e);
    return false;
  }
}

function deleteFolder(path) {
  let files = [];
  if (existsSync(path)) {
    files = readdirSync(path);
    files.forEach(function (file, index) {
      let curPath = path + "/" + file;
      if (statSync(curPath).isDirectory()) {
        deleteFolder(curPath);
      } else {
        unlinkSync(curPath);
      }
    });
    rmdirSync(path);
  }
}

module.exports = {
  fileIsExist,
  deleteFolder,
}