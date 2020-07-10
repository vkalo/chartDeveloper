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
    form.submit(url, function (err, res) {
      if (err || !String(res.statusCode).startsWith('2')) {
        reject(err,res);
        return;
      }
      deleteFolder(outlet);
      resolve();
    });
  })
}

exports.sendModule = sendModule;