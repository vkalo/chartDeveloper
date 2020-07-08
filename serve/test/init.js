

const { readFileSync, existsSync } = require('fs');
const { join } = require('path');
const { setModule } = require('./utils');
const { inlet, outlet } = JSON.parse(readFileSync(join(__dirname, './config.json')));

try {
  existsSync(join(inlet, 'package.json'));
  existsSync(join(inlet, 'index.js'));
} catch (err) {
  throw new Error('缺少index.js或package.js', err);
}
console.log('初始化图表信息')
const chartInfo = {
  outfiles: {},
  allFiles:{}, //所有文件原始信息
  moduleList: {}, //模块文件
  othersList: {}, //非模文件
  chartName: null,
  errors:{}, // 错误池

  outlet,
  inlet,
}



const packageText = readFileSync(join(inlet, 'package.json'), 'utf-8');
const packageJson = JSON.parse(packageText);
const { name, version } = packageJson;
const entryPath = join(inlet, 'index.js');
const { moduleName, modulePath } = setModule(name, version);
const rootReg = new RegExp(`^${inlet}(?!node_modules/)`);

chartInfo.outfiles[moduleName + '/package.json'] = packageText;
chartInfo.packageJson = packageJson;
chartInfo.chartName = moduleName;
chartInfo.entryPath = entryPath;
chartInfo.moduleList = {
  [moduleName]: { name, version, entryPath, rootReg, moduleName, modulePath, needUpdate: true },
};

module.exports = chartInfo;