#!/usr/bin/env node

// 引入依赖
var program = require('commander');
const { copyFolder, isEmpty, warn } = require('../serve/utils');
const { setUrl, setInlet } = require('../serve/commande');
const { join } = require('path');
const chartType = {
  'common': true,
}

// 定义版本和参数选项
program
  .version('0.1.0', '-v, --version')
  .option('-i, --init [type]', 'init build environment')
  .option('-u, --url [url]', 'set the url which you want send to')
  .option('-d, --dev', 'run dev')
  .option('-b, --build', 'build a package');

// 必须在.parse()之前，因为node的emit()是即时的
program.on('--help', function () {
  console.log('  Examples: nazaDev -i ');
});

program.parse(process.argv);

if (program.init) {
  const type = chartType[program.init] ? program.init : 'common';
  const inlet = process.cwd();
  const chartFolder = join(__dirname, '../store/' + type);
  if (!isEmpty(inlet)) {
    warn('请选择空文件夹');
    return null;
  }
  copyFolder(chartFolder, inlet);
  console.log('初始化完成');
}

if (program.url) {
  setUrl(program.url)
}

if (program.dev) {
  console.log('启动服务器')
  setInlet(process.cwd());
  require('./www');
}

if (program.build) {
  console.log('remove something')
}