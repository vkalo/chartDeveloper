const { statSync, existsSync, readdirSync, unlinkSync, rmdirSync, writeFileSync, readFileSync } = require('fs');
const { dirname, join } = require('path');
const { currDirRegExp } = require('./reg');
/**
 * 删除文件夹
 * @param {String} path 
 */
function deleteFolder(path) {
  let files = [];
  if (existsSync(path)) {
    files = readdirSync(path);
    files.forEach(function (file, index) {
      let curPath = path + "/" + file;
      if (statSync(curPath).isDirectory()) {
        deleteFolder(curPath);
      } else {
        unlinkSync(curPath);
      }
    });
    rmdirSync(path);
  }
}

function isEmpty(path) {
  const files = readdirSync(path).filter(p => !(p.startsWith('.') || p.startsWith('node_modules')))
  return files.length === 0;
}

/**
 * 拷贝文件夹
 * @param {String} inlet  路口文件夹
 * @param {String} outlet 出口文件夹
 */
function copyFolder(inlet, outlet) {
  const list = readdirSync(inlet).map(p => join(inlet, p));
  while (list.length > 0) {
    const path = list.shift();
    if (statSync(path).isDirectory()) {
      list.push(...readdirSync(path).map(p => join(path, p)))
    } else {
      const text = readFileSync(path);
      outFile(path.replace(inlet, outlet), text);
    }
  }
}
/**
 *  读取文件夹内所有文件（不包括node_modules）
 * @param {*} folderPath 
 */
function readFolder(folderPath) {
  const list = readdirSync(folderPath).map(p => join(folderPath, p));
  const res = {};
  while (list.length > 0) {
    const path = list.shift();
    if (statSync(path).isDirectory()) {
      !path.includes('node_modules') && list.push(...readdirSync(path).map(p => join(path, p)))
    } else {
      res[path] = readFileSync(path);
    }
  }
  return res;
}


const JSZip = require('jszip');

/**
 * zip 压缩文件
 * @param {Object} fileList {path:text}
 */
async function zipFile(fileList) {
  const zip = new JSZip();
  Object.entries(fileList).forEach(([path, text]) => {
    zip.file(path, text);
  });

  return await zip.generateAsync({//设置压缩格式，开始打包
    type: "nodebuffer",//nodejs用
    compression: "DEFLATE",//压缩算法
    compressionOptions: {//压缩级别
      level: 9
    }
  });
}

const mkdirp = require('mkdirp');

/**
 * 输出文件
 * @param {string} path 
 * @param {string} text 
 */
function outFile(path, text) {
  return mkdirp(dirname(path)).then(() => {
    writeFileSync(path, text, "utf-8");
  })
}
/**
 * 配置模块
 * @param {string} name 模块名
 * @param {string} version 版本👌
 */
function setModule(name, version) {
  const moduleName = name + '@' + version;
  const modulePath = `${moduleName}/index.js`;
  return { moduleName, modulePath };
}

var styles = {
  'bold': ['\x1B[1m', '\x1B[22m'],
  'italic': ['\x1B[3m', '\x1B[23m'],
  'underline': ['\x1B[4m', '\x1B[24m'],
  'inverse': ['\x1B[7m', '\x1B[27m'],
  'strikethrough': ['\x1B[9m', '\x1B[29m'],
  'white': ['\x1B[37m', '\x1B[39m'],
  'grey': ['\x1B[90m', '\x1B[39m'],
  'black': ['\x1B[30m', '\x1B[39m'],
  'blue': ['\x1B[34m', '\x1B[39m'],
  'cyan': ['\x1B[36m', '\x1B[39m'],
  'green': ['\x1B[32m', '\x1B[39m'],
  'magenta': ['\x1B[35m', '\x1B[39m'],
  'red': ['\x1B[31m', '\x1B[39m'],
  'yellow': ['\x1B[33m', '\x1B[39m'],
  'whiteBG': ['\x1B[47m', '\x1B[49m'],
  'greyBG': ['\x1B[49;5;8m', '\x1B[49m'],
  'blackBG': ['\x1B[40m', '\x1B[49m'],
  'blueBG': ['\x1B[44m', '\x1B[49m'],
  'cyanBG': ['\x1B[46m', '\x1B[49m'],
  'greenBG': ['\x1B[42m', '\x1B[49m'],
  'magentaBG': ['\x1B[45m', '\x1B[49m'],
  'redBG': ['\x1B[41m', '\x1B[49m'],
  'yellowBG': ['\x1B[43m', '\x1B[49m']
}

function warn(message) {
  const key = 'red'
  console.log(styles[key][0] + '%s' + styles[key][1], message)
}

function replacePackage(text, moduleName) {
  const package = JSON.parse(text);
  if (package.chartConfig && currDirRegExp.test(package.chartConfig.poster)) {
    package.chartConfig.poster = join(moduleName, package.chartConfig.poster);
    return JSON.stringify(package, null, '\t');
  } else {
    return text;
  }
}

module.exports = {
  deleteFolder,
  copyFolder,
  readFolder,
  zipFile,
  outFile,
  setModule,
  isEmpty,
  warn,
  replacePackage,
}