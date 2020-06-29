const babel = require("@babel/core");
const options = require('../babel.config');
const resolve = require("enhanced-resolve"); // 路径解析工具
const utils = require('./utils');
var fs = require('fs');
var path = require('path');

function addColon(string) {
  return `'${string}'`
}
function commentReplace(match, singlePrefix) {
  if (singlePrefix === '\\') {
    return match;
  }
  return singlePrefix || '';
}

var commentRegExp = /\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/mg;
var requireRegExp = /\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;
var jsSuffixRegExp = /\.js$/i;
var currDirRegExp = /^\.\/|\.\.\//;

var servePath = '/Users/likairui/Desktop/demos/express-modlue';
var i = 1;
module.exports = function (id, publicPath, callback) {

  if (!/^\/node_modules\//.test(id)) {
    var filePath = path.join(publicPath, id);
  } else {
    var filePath = path.join(servePath, id);
  }
  console.log(filePath);
  fs.readFile(filePath, 'utf-8', function (err, data) {
    if (err) {
      console.error(err);
      callback('404');
    }
    else {
      // var newCode = data.replace(commentRegExp, commentReplace);
      var newCode = babel.transform(data, options).code.replace(commentRegExp, commentReplace);
      var childList = [];
      newCode = newCode.replace('_interopRequireDefault', 'require');
      newCode = newCode.replace(requireRegExp, function (item) {
        var childPath = item.replace(/^\s*require\(['"]?|['"]?\)$/g, '');
        if (currDirRegExp.test(childPath)) {
          childPath = path.join(filePath, '../', childPath);
        } else {
          try {
            childPath = resolve.sync(filePath, childPath);
          } catch{
            console.log('没有找到文件');
            return item;
          }
        }
        if (childPath.match(publicPath)) {
          childPath = childPath.replace(publicPath, '');
        } else {
          childPath = childPath.replace(servePath, '');
        }
        childPath = childPath.replace(jsSuffixRegExp, '') + '.js';
        childPath = addColon(childPath);
        childList.push(childPath);
        // console.log(childList)
        return `require(${childPath})`;
      })
      callback(` define('${id}',[${childList.toString()}], function (require, exports, module){
        ${newCode}
      })`)
    }
  })
}
