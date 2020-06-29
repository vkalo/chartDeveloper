
var { readFileSync, mkdirSync, writeFileSync, existsSync } = require('fs');
var { join, resolve, dirname } = require('path');
var { deleteFolder } = require('./utils');
var JSZip = require('jszip');
var zip = new JSZip();

const { transLateFiles } = require('./transcoding');


const mkdirp = require('mkdirp')

const configPath = join(__dirname, './config.json');
const { inlet, outlet } = JSON.parse(readFileSync(configPath));

function outFiles(path, text) {
  mkdirp(dirname(path)).then(() => {
    writeFileSync(path, text, "utf-8");
  })
}

const chartInfo = {
  file: {},
  outlet,
  inlet,
  chartName: null,
  dependencies: null,
  entry: null,
}

function importChart() {
  if (existsSync(join(inlet, 'package.json')) && existsSync(join(inlet, 'index.js'))) {
    console.log('开始读取')
    const packageJson = JSON.parse(readFileSync(resolve(inlet, 'package.json'), 'utf-8'));
    const chartName = packageJson.name + '@' + packageJson.version;
    const entry = chartName + '/index.js';
    chartInfo.chartName = chartName;
    chartInfo.entry = entry;
    writeFileSync(configPath, JSON.stringify({ inlet, outlet, chartName }, null, '\t'))

    deleteFolder(outlet); // 文件夹初始化
    mkdirSync(outlet);

    const fileList = [{
      path: resolve(inlet, 'index.js'),
      modulePath: entry,
    }];

    const dependencies = { [packageJson.name]: packageJson.version };
    const overList = {};

    // 输出图表文件
    while (fileList.length > 0) {
      const { path: filesPath, modulePath } = fileList.shift();
      if (!overList[filesPath]) {
        const { subList, text } = transLateFiles(filesPath, dependencies, modulePath);
        chartInfo.file[modulePath] = { subList, text };
        fileList.push(...subList);
        overList[filesPath] = true;
      }
    }

    chartInfo.dependencies = dependencies;

    chartInfo.file[chartName + '/package.json'] = { text: JSON.stringify(packageJson, null, '\t') };
    console.log('读取完成');
  } else {
    return {
      state: false,
      message: `未在${inlet}内找到package.json和index.js`,
    }
  }
}

function exportFile() {
  const { file, entry, dependencies, outlet } = chartInfo
  const packageJson = entry.replace('index.js', 'package.json');
  const resouceMap = {};
  const list = [{
    modulePath: entry,
    path: [],
  }];
  const overList = {};

  while (list.length > 0) {
    const { modulePath, path } = list.shift();
    if (!overList[modulePath]) {
      const newPath = [...path, modulePath];
      const target = (path.reduce((res, key) => res[key], resouceMap)[modulePath] = {});
      const { subList, text } = file[modulePath];
      subList.forEach(({ modulePath }) => {
        target[modulePath] = {};
        list.push({ modulePath, path: newPath });
      });
      outFiles(join(outlet, modulePath), text);
      zip.file(modulePath, text);
      overList[modulePath] = true;
    }
  }

  // outFiles(join(outlet, 'dependencies.json'), JSON.stringify(dependencies, null, '\t'));
  // outFiles(join(outlet, 'resouceMap.json'), JSON.stringify(resouceMap, null, '\t'));
  outFiles(join(outlet, packageJson), file[packageJson].text);
  zip.file(packageJson, file[packageJson].text);
  zip.generateAsync({//设置压缩格式，开始打包
    type: "nodebuffer",//nodejs用
    compression: "DEFLATE",//压缩算法
    compressionOptions: {//压缩级别
      level: 9
    }
  }).then(function (content) {
    outFiles(outlet + "/result.zip", content);
    console.log('输出完成')
  });
}

importChart();
exportFile();

module.exports = { chartInfo, exportFile };