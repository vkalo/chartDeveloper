
const { join } = require('path');
const { exportModule, inlet, moduleName } = require('../serve/index');
const { zipFile, outFile, deleteFolder, readFolder } = require('./utils');


const config = {
  "inlet": "/Users/likairui/Desktop/demos/chart/",
  "entryPath": "/Users/likairui/Desktop/demos/chart/index.js",
  "outlet": "/Users/likairui/Desktop/demos/chartDeveloper/out/",
  "chartName": "globe_3d@0.0.1",
  "extra": ["/Users/likairui/Desktop/demos/chart/package.json"]
};

async function exportChart(outlet) {
  console.log('开始输出图表')
  deleteFolder(outlet); // 文件夹初始化
  // mkdirSync(outlet);
  const out = {};

  const originFiles = Object.entries(readFolder(inlet)).reduce((res, [path, text]) => {
    res[path.replace(config.inlet, '')] = text;
    return res;
  }, {});

  out[`${moduleName}/index.zip`] = await zipFile(originFiles);
  Object.assign(out, exportModule());

  const zipText = await zipFile(out);

  Object.entries(out).forEach(([path, text]) => {
    outFile(join(outlet, path), text);
  });
  outFile(outlet + "/out.zip", zipText);
  console.log('图表输出完成')
}

module.exports = {
  exportChart,
}