
const babel = require("@babel/core");
const babelOptions = require('../babel.config');
const { readFileSync } = require('fs');
const { realPath, getModulePath } = require('./parsePath');

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

function transLateFiles(filePath) {
  let text = '';
  const imports = []; // 模块内依赖
  const modulePath = getModulePath(filePath);
  // 不是js文件不用翻译
  try {
    if (jsSuffixRegExp.test(filePath)) {
      text = readFileSync(filePath, 'utf-8');
      text = (!filePath.includes('core-js') ? babel.transform(text, babelOptions).code : text);  //转码
      text = text.replace(commentRegExp, commentReplace);//移除注释 
      text = text.replace(requireRegExp, function (item) {
        var fileName = item.replace(/^\s*require\(['"]?|['"]?\)$/g, '');
        var importPath = realPath(fileName, filePath); // 引入绝对路径
        var modulePath = getModulePath(importPath);// 模块路径

        imports.push(importPath);

        return `opener('${modulePath}')`;
      })
    } else {
      text = readFileSync(filePath);
    }
    return { imports, text, modulePath }
  } catch (err) {
    throw err;
    // throw new Error(`${filePath}文件无法读取`,err.message);
  }
}
module.exports = { transLateFiles };