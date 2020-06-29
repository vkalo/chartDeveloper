
const babel = require("@babel/core");
const babelOptions = require('../babel.config');
const eResolve = require("enhanced-resolve"); // 路径解析工具
const { readFileSync, existsSync, statSync } = require('fs');
const { resolve } = require('path');

// 正则移除注释
function commentReplace(match, singlePrefix) {
  if (singlePrefix === '\\') {
    return match;
  }
  return singlePrefix || '';
}

var commentRegExp = /\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/mg; // 注释匹配正则
var requireRegExp = /\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g; // require匹配正则
var jsSuffixRegExp = /\.js$/i; // js匹配正则
var currDirRegExp = /^\.\/|\.\.\//; //相对路径匹配正则
var modulePathReg = /^.*\/node_modules\/(.*?)(?=\/)/;// 匹配模块地址和模块名；

// 获取真实路径
function getRealPath(path, filePath) {
  var realPath = null;
  try {
    if (currDirRegExp.test(path)) {
      realPath = resolve(filePath, '../', path);

      if (existsSync(realPath) && statSync(realPath).isFile()) {
        return realPath;
      } else {
        realPath += '.js';
        if (existsSync(realPath)) {
          return realPath;
        }
        throw Error('文件未找到');
      }

    } else {
      try{
        return eResolve.sync(filePath, path).replace(jsSuffixRegExp, '') + '.js';
      }catch(err) {
        return eResolve.sync(__dirname, path).replace(jsSuffixRegExp, '') + '.js';
      }
    }
  } catch (err) {
    debugger
    throw new Error(`${filePath}文件内的${path}未找到，`);
  }
}

function getModulePath(path, rootPath, outModule, dependencies) {
  if (path.includes(rootPath+'/')&&!path.includes(rootPath+'/node_modules/')) {
    return path.replace(rootPath, `${outModule}`);
  } else {
    var [modulePath, moduleName] = path.match(modulePathReg)
    if (!dependencies[moduleName]) {
      const { version } = JSON.parse(readFileSync(resolve(modulePath, './package.json')));
      dependencies[moduleName] = version;
    }
    return path.replace(modulePathReg, moduleName + '@' + dependencies[moduleName]);
  }
}

function getFileType(path) {
  return path.split('.').pop();
}

/**
 * 
 * @param {String} filePath 文件绝对路径
 * @param {String} rootPath 导入模块根目录
 * @param {String} outModule 导出模块名
 * @param {Object} dependencies 模块依赖版本信息
 */
function transLateFiles(filePath, rootPath, outModule, dependencies = {}) {
  let text = '';
  const moduleName = filePath.replace(rootPath, `${outModule}`);

  // 不是js文件不用翻译
  if (jsSuffixRegExp.test(filePath)) {
    try {
      text = readFileSync(filePath, 'utf-8');
    } catch (err) {
      return new Error(`${filePath}文件无法读取`);
    }
  } else {
    text = readFileSync(filePath);
    return { subList: [], text };
  }

  text = (!outModule.includes('core-js') ? babel.transform(text, babelOptions).code : text);  //转码
  text = text.replace(commentRegExp, commentReplace);//移除注释 

  var dependent = [];
  var subList = []; // 模块内依赖

  text = text.replace(requireRegExp, function (item) {

    var fileName = item.replace(/^\s*require\(['"]?|['"]?\)$/g, '');

    var importPath = getRealPath(fileName, filePath); // 引入绝对路径
    var modulePath = getModulePath(importPath, rootPath, outModule, dependencies);// 模块路径

    subList.push({ path: importPath, modulePath });

    switch (getFileType(importPath)) {
      case 'js': {
        dependent.push(`'${modulePath}'`);
        return `opener('${modulePath}')`;
      }
      case 'json': {
        dependent.push(`'${modulePath}'`);
        return `opener('${modulePath}')`;
      }
      case 'css': {
        return `opener('${modulePath}')`;
      }
      default: {
        return `'${modulePath}?module=true'`
      }
    }
  })

  return {
    subList,
    text: `cover('${moduleName}',[${dependent.toString()}], function (opener, exports, module){
      ${text}
    })`,
  }
}

module.exports = { transLateFiles };