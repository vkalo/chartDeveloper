

module.exports.currDirRegExp = /^\.\/|\.\.\//; //相对路径匹配正则

module.exports.jsSuffixRegExp = /\.js$/i; // js匹配正则

module.exports.modulePathReg = /^.*\/node_modules\/(.*?)(?=\/)/;// 匹配模块地址和模块名；