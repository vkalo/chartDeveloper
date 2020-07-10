
const { join } = require('path');
const { exportModule, inlet, moduleName } = require('./index');
const { zipFile, outFile, deleteFolder, readFolder } = require('./utils');
const { mkdirSync } = require('fs');

async function exportFiles() {
  console.log('开始输出图表')

  const files = {};
  const originFiles = Object.entries(readFolder(inlet)).reduce((res, [path, text]) => {
    res[path.replace(inlet, '')] = text;
    return res;
  }, {});

  files[`${moduleName}/index.zip`] = await zipFile(originFiles);

  Object.assign(files, exportModule());
  const zip = await zipFile(files);
  console.log('图表输出完成');
  return { files, zip };
}


async function outFiles(outlet) {
  deleteFolder(outlet); // 文件夹初始化
  mkdirSync(outlet);
  const { files, zip } = await exportFiles();

  Object.entries(files).forEach(([path, text]) => {
    outFile(join(outlet, path), text);
  });

  outFile(outlet + "/out.zip", zip);
}

module.exports = {
  exportFiles,
  outFiles,
}