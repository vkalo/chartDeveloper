var { createReadStream, mkdirSync, readFileSync } = require('fs')
var { join } = require('path');
var { exportFiles } = require('./outChart');
var FormData = require('form-data');
const { outFile, deleteFolder } = require('./utils');
const configPath = join(__dirname, '../config.json');
const moduleInfo = require('./index');

async function sendModule() {
  const { zip } = await exportFiles();
  const { url } = JSON.parse(readFileSync(configPath));
  const form = new FormData();
  const outlet = join(__dirname, "../out/");
  deleteFolder(outlet);
  mkdirSync(outlet);
  await outFile(join(__dirname, "../out/out.zip"), zip);
  form.append("mark", moduleInfo.moduleName);
  form.append("chart", createReadStream(join(__dirname, "../out/out.zip")));
  return new Promise((resolve, reject) => {
    form.submit(url, function (error, res) {
      if (error || !String(res.statusCode).startsWith('2')) {
        const data = { error, status: res.statusCode, message: res.statusMessage };
        console.log('保存失败');
        console.log(data)
        reject(data);
        return;
      }
      console.log("保存成功")
      deleteFolder(outlet);
      resolve();
    });
  })
}

exports.sendModule = sendModule;