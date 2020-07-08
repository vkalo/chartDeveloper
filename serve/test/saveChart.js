
var { readFileSync, mkdirSync, writeFileSync, existsSync } = require('fs');
var { join, resolve, dirname } = require('path');
var { deleteFolder } = require('./utils');

const { transLateFiles } = require('./transcoding');


const mkdirp = require('mkdirp')

const configPath = join(__dirname, './config.json');
const { inlet, outlet } = JSON.parse(readFileSync(configPath));

function outFiles(path, text) {
  mkdirp(dirname(path)).then(() => {
    writeFileSync(path, text);
  })
}

function exportChart() {
  if (existsSync(join(inlet, 'package.json')) && existsSync(join(inlet, 'index.js'))) {
    const packageJson = JSON.parse(readFileSync(resolve(inlet, 'package.json'), 'utf-8'));
    const chartName = packageJson.name + '@' + packageJson.version;
    writeFileSync(configPath, JSON.stringify({ inlet, outlet, chartName }, null, '\t'))
    const resouceMap = { [chartName]: {} }; // 依赖关系图谱

    deleteFolder(outlet); // 文件夹初始化
    mkdirSync(outlet);

    const fileList = [{
      path: resolve(inlet, 'index.js'),
      resouceRouter: [chartName],
      modulePath: chartName + '/index.js',
    }];

    const dependencies = { [packageJson.name]: packageJson.version };
    const overList = {};

    // 输出图表文件
    while (fileList.length > 0) {
      const { path: filesPath, resouceRouter, modulePath } = fileList.shift();
      if (!overList[filesPath]) {
        const subList = transFile(filesPath, dependencies, modulePath)

        const resouceTarget = resouceRouter.reduce((res, key) => res[key], resouceMap);

        subList.forEach(item => {
          item.resouceRouter = [...resouceRouter, item.modulePath];
          resouceTarget[item.modulePath] = {};
          fileList.push(item);
        })
        overList[filesPath] = true;
      }
    }

    writeFileSync(join(outlet, 'dependencies.json'), JSON.stringify(dependencies, null, '\t'));
    writeFileSync(join(outlet, 'resouceMap.json'), JSON.stringify(resouceMap, null, '\t'));

    outFiles(join(outlet + '/' + chartName + '/', 'package.json'), JSON.stringify(packageJson, null, '\t'))
    console.log('输出完成')
  } else {
    return {
      state: false,
      message: `未在${inlet}内找到package.json和index.js`,
    }
  }
}

function transFile(filesPath, dependencies = {}, modulePath) {
  const { text, subList } = transLateFiles(filesPath, dependencies, modulePath);

  outFiles(join(outlet, modulePath), text);

  return subList;
}

// exportChart();
module.exports = {
  exportChart,
  transFile,
}