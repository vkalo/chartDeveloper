
const { join } = require('path');
const { exportModule, inlet, moduleName } = require('./index');
const { zipFile, outFile, deleteFolder, readFolder } = require('./utils');
const { mkdirSync } = require('fs');

const config = {
  "inlet": "/Users/likairui/Desktop/demos/chart/",
  "entryPath": "/Users/likairui/Desktop/demos/chart/index.js",
  "outlet": "/Users/likairui/Desktop/demos/chartDeveloper/out/",
  "chartName": "globe_3d@0.0.1",
  "extra": ["/Users/likairui/Desktop/demos/chart/package.json"]
};

async function exportFiles() {
  console.log('开始输出图表')

  const files = {};
  const originFiles = Object.entries(readFolder(inlet)).reduce((res, [path, text]) => {
    res[path.replace(config.inlet, '')] = text;
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