var { outfiles, errors } = require('../serve/index');
module.exports = function (req, res, next) {
  if (Object.keys(errors).length > 0) {
    res.setHeader('Content-type', 'text/plain;charset=utf-8')
    res.end('模块化失败。请先检查错误');
  } else {
    const path = req.path.replace('/', '');
    res.end(outfiles[path]);
  }
}
