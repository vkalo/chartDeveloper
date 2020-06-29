
const babel = require("@babel/core");
const babelOptions = require('../babel.config');
const eResolve = require("enhanced-resolve"); // 路径解析工具
const { readFileSync, existsSync, statSync } = require('fs');
const { resolve, join } = require('path');
const { inlet, outlet, chartName } = JSON.parse(readFileSync(join(__dirname, './config.json')));
var uglifyjs = require("uglify-es");

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
      try {
        return eResolve.sync(filePath, path).replace(jsSuffixRegExp, '') + '.js';
      } catch (err) {
        return eResolve.sync(__dirname, path).replace(jsSuffixRegExp, '') + '.js';
      }
    }
  } catch (err) {
    throw new Error(`${filePath}文件内的${path}未找到，`);
  }
}

function getModulePath(path, dependencies) {
  if (!path.includes('/node_modules/')) {
    return path.replace(inlet, `${chartName}/`);
  } else {
    var [modulePath, moduleName] = path.match(modulePathReg)
    if (!dependencies[moduleName]) {
      const { version } = JSON.parse(readFileSync(resolve(modulePath, './package.json')));
      dependencies[moduleName] = version;
    }
    return path.replace(modulePathReg, moduleName + '@' + dependencies[moduleName]);
  }
}

/**
 * 
 * @param {String} filePath 文件绝对路径
 * @param {Object} dependencies 模块依赖版本信息
 */
function transLateFiles(filePath, dependencies = {}, moduleName) {
  let text = '';

  // 不是js文件不用翻译
  try {
    if (jsSuffixRegExp.test(filePath)) {
      text = readFileSync(filePath, 'utf-8');
    } else {
      text = readFileSync(filePath);
      return { subList: [], text };
    }
  } catch (err) {
    return new Error(`${filePath}文件无法读取`);
  }

  text = (!filePath.includes('core-js') ? babel.transform(text, babelOptions).code : text);  //转码
  text = text.replace(commentRegExp, commentReplace);//移除注释 

  var dependent = [];
  var subList = []; // 模块内依赖

  text = text.replace(requireRegExp, function (item) {
    var fileName = item.replace(/^\s*require\(['"]?|['"]?\)$/g, '');
    var importPath = getRealPath(fileName, filePath); // 引入绝对路径
    var modulePath = getModulePath(importPath, dependencies);// 模块路径

    subList.push({ path: importPath, modulePath });

    if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
      dependent.push(`'${modulePath}'`);
    }
    return `opener('${modulePath}')`;
  })
  // text=;
  // text = uglifyjs.minify(text).code;

  return {
    subList,
    text: `pack('${moduleName}',[${dependent.toString()}], function (opener, exports, module){
      ${text}
    })`,
  }
}

module.exports = { transLateFiles };