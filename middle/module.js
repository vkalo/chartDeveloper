var {chartInfo} = require('../serve/loadChart');
var { join } = require('path');
var { readFile } = require('fs');
// 模块中间件
var libDir = join(__dirname, '../out');

module.exports = function (req, res, next) {
  if (req.path.startsWith('/chart')) {

    // const path = join(libDir, req.path.replace('/chart',''));

    // readFile(path, function (err, text) {
    //   if (err) {
    //     console.log(err)
    //     res.end(err);
    //     return;
    //   }
    //   res.end(text);
    // })
    const path = req.path.replace('/chart/','');

    res.end(chartInfo.file[path].text);

    // var id = req.originalUrl.split('?')[0];
    // // filePath = path.join(__dirname, '/public', filePath);
    // transcoding(id, publicPath, function (code) {
    //   res.write(code);
    //   res.end();
    // })
  } else {
    next();
  }
}
