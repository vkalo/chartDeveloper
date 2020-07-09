var express = require('express');
var router = express.Router();
var { IncomingForm } = require('formidable');
var { join } = require('path');
var { readFileSync, writeFileSync, unlinkSync } = require('fs');
var { inlet, moduleName } = require('../serve/index')
router.post('/', function (req, res, next) {
  var form = new IncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = join(__dirname, "../upload");
  form.keepExtensions = true;//保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024;
  //处理图片
  form.parse(req, function (err, fields, files) {
    const poster = files.poster;
    if (!poster) {
      res.json({ status: false, message: '保存失败' });
    }
    const { path } = poster;
    const type = path.split('.').pop();
    const img = readFileSync(path);
    const imgName = 'poster.' + type;
    writeFileSync(join(inlet, imgName), img);

    const package = JSON.parse(readFileSync(join(inlet, '/package.json')));
    package.chartConfig.poster = `${moduleName}/${imgName}`;
    writeFileSync(join(inlet, '/package.json'), JSON.stringify(package, null, '\t'));
    unlinkSync(path);
    res.json({ status: true, message: '保存成功' });
  })
});

module.exports = router;
