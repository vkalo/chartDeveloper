
const webSocket = require('./webSocket');
const  {replacePackage} = require('./utils');
const init = require('pack-opener-plugin');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const { currDirRegExp, httpReg } = require('./reg');
const configPath = join(__dirname, '../config.json');
const config = JSON.parse(readFileSync(configPath));
const entryPath = join(config.inlet, 'index.js');
const packagePath = join(config.inlet, 'package.json');
const { name, version, chartConfig } = JSON.parse(readFileSync(packagePath, 'utf-8'));
const hotCallback = [function (f, t) {
  webSocket.connections.forEach(function (conn) {
    conn.sendText('刷新')
  })
}];
const extra = [packagePath];

if (chartConfig.poster && currDirRegExp.test(chartConfig.poster)) {
  extra.push(join(config.inlet, chartConfig.poster));
}

const moduleInfo = init({ entryPath, extra, name, version, hotCallback });
const { moduleName } = moduleInfo;
config.moduleName = moduleName;
writeFileSync(configPath, JSON.stringify(config, null, '\t'));
moduleInfo.outfiles[`${moduleName}/package.json`] = replacePackage(moduleInfo.outfiles[`${moduleName}/package.json`],moduleName)

module.exports = moduleInfo;