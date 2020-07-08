#!/usr/bin/env node

// 引入依赖
var program = require('commander');
const { deleteFolder, copyFolder } = require('../serve/utils');
const { join } = require('path');
chartType = {
  'common': true,
}
// 定义版本和参数选项
program
  .version('0.1.0', '-v, --version')
  .option('-i, --init [type]', 'init build environment', 'common')
  .option('-d, --dev', 'run dev')
  .option('-b, --build', 'build a package');

// 必须在.parse()之前，因为node的emit()是即时的
program.on('--help', function () {
  console.log('  Examples: nazaDev -i ');
});

program.parse(process.argv);

if (program.init) {
  console.log(program.init)
  const type = chartType[program.init] ? program.init : 'common';
  const inlet = process.cwd();
  const chartFolder = join(__dirname, '../store/' + type);
  deleteFolder(inlet);
  copyFolder(chartFolder, inlet);
}

if (program.dev) {
  console.log('generate something')
}

if (program.build) {
  console.log('remove something')
}