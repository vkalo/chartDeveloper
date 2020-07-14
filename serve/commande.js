const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const configPath = join(__dirname, '../config.json');
const protocolReg = /^http(s)?:\/\//;


function setConfig(key, value) {
  const config = JSON.parse(readFileSync(configPath));
  config[key] = value;
  writeFileSync(configPath, JSON.stringify(config, null, '\t'))
}
function setUrl(url) {
  url = protocolReg.test(url) ? url : 'http://' + url;
  setConfig('url', url);
}

function setInlet(inlet) {
  setConfig('inlet', inlet);
}

const currDirRegExp = /^\.\/|\.\.\//; //相对路径匹配正则
function executePath(path = '') {
  if (currDirRegExp.test(path)) {
    return join(process.cwd(), path);
  } else {
    return path;
  }
}


module.exports = {
  setUrl,
  setInlet,
  executePath,
}