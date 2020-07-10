
var webSocket = require('./webSocket');
var init = require('pack-opener-plugin');
var { readFileSync, writeFileSync } = require('fs');
var { join } = require('path');

const configPath = join(__dirname, '../config.json');
const config = JSON.parse(readFileSync(configPath));
const entryPath = join(config.inlet, 'index.js');
const packagePath = join(config.inlet, 'package.json');
const { name, version } = JSON.parse(readFileSync(packagePath, 'utf-8'));
const hotCallback = [function (f, t) {
  webSocket.connections.forEach(function (conn) {
    conn.sendText('刷新')
  })
}];

const moduleInfo = init({ entryPath, extra: [packagePath], name, version, hotCallback });

config.moduleName = moduleInfo.moduleName;
writeFileSync(configPath, JSON.stringify(config, null, '\t'))

module.exports = moduleInfo;