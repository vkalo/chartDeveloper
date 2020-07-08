const eResolve = require("enhanced-resolve"); // 路径解析工具
const { readFileSync, existsSync, statSync } = require('fs');
const { resolve } = require('path');
const { currDirRegExp, jsSuffixRegExp, modulePathReg } = require('../../constants/reg');
const { inlet, moduleList, chartName } = require('./init');
const { setModule } = require('../utils');

function realPath(requirePath, filePath) {
  try {
    if (currDirRegExp.test(requirePath)) {
      return fromRelativePath(requirePath, filePath)
    } else {
      return fromModulePath(requirePath)
    }
  } catch (err) {
    throw new Error(`${filePath}文件内的${requirePath}未找到，`);
  }
}

function fromRelativePath(requirePath, filePath) {
  let realPath = resolve(filePath, '../', requirePath);
  if (existsSync(realPath) && statSync(realPath).isFile()) {
    return realPath;
  } else {
    if (existsSync(realPath + '.js')) {
      return realPath + '.js';
    } else if (existsSync(realPath + '/index.js')) {
      return realPath + '/index.js';
    }
    throw Error('文件未找到');
  }
}

function fromModulePath(requirePath) {
  try {
    return eResolve.sync(inlet, requirePath).replace(jsSuffixRegExp, '') + '.js';
  } catch (err) {
    return eResolve.sync(__dirname, requirePath).replace(jsSuffixRegExp, '') + '.js';
  }
}


const pathMap={};
function getModulePath(path) {
  if(pathMap[path]){
    return pathMap[path];
  }
  if (!path.includes('/node_modules/')) {
    pathMap[path] = path.replace(inlet, `${chartName}/`);
  } else {
    const [rootPath, name] = path.match(modulePathReg);
    if (!moduleList[name]) {
      const { version } = JSON.parse(readFileSync(resolve(rootPath, './package.json')));
      const { moduleName, modulePath } = setModule(name, version);
      const entryPath = realPath(name);
      const rootReg = new RegExp(`^${rootPath}`);
      moduleList[name] = { name, version, entryPath, rootReg, moduleName, modulePath };
    }
    pathMap[path] = path.replace(modulePathReg, name + '@' + moduleList[name].version);
  }
  return pathMap[path];
}

module.exports = {
  realPath,
  getModulePath,
}