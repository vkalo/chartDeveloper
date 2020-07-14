#!/usr/bin/env node

// 引入依赖
var program = require('commander');
const { copyFolder, isEmpty, warn } = require('../serve/utils');
const { setUrl, setInlet, executePath } = require('../serve/commande');
const { join } = require('path');
const chartType = {
  'common': true,
}

// 定义版本和参数选项
program
  .version('0.1.0', '-v, --version')
  .option('-i, --init [type]', 'init build environment')
  .option('-u, --url [url]', 'set the url which you want send to')
  .option('-d, --dev [path]', 'run dev')
  .option('-b, --build [path]', 'build a package');

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
  const devPath = typeof program.dev === 'string' ? program.dev : '';
  setInlet(executePath(devPath));
  require('./www');
}

if (program.build) {
  const outPath = typeof program.build === 'string' ? program.build : './out';
  const { outFiles } = require('../serve/outChart');
  outFiles(executePath(outPath));
}