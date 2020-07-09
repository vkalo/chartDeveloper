const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const configPath = join(__dirname, '../config.json');
const protocolReg = /^http(s)?:\/\//;


function setConfig(key,value){
  const config = JSON.parse(readFileSync(configPath));
  config[key] = value;
  writeFileSync(configPath, JSON.stringify(config, null, '\t'))
}
function setUrl(url) {
  url = protocolReg.test(url) ? url : 'http://' + url;
  setConfig('url',url);
}


function setInlet(inlet){
  setConfig('inlet',inlet);
}
module.exports = {
  setUrl,
  setInlet,
}