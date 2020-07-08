var { outfiles, errors } = require('../serve/index');
// var { join } = require('path');
// var { readFile } = require('fs');
// // 模块中间件
// var libDir = join(__dirname, '../out');

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
    if (Object.keys(errors).length > 0) {
      res.setHeader('Content-type', 'text/plain;charset=utf-8')
      res.end('模块化失败。请先检查错误');
    }
    const path = req.path.replace('/chart/', '');

    res.end(outfiles[path]);

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
