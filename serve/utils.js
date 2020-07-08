const { statSync, existsSync, readdirSync, unlinkSync, rmdirSync, writeFileSync, readFileSync } = require('fs');
const { dirname, join } = require('path');

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
  }
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

module.exports = {
  deleteFolder,
  copyFolder,
  readFolder,
  zipFile,
  outFile,
  setModule,
}