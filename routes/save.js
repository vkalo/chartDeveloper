var express = require('express');
var router = express.Router();
var { sendModule } = require('../serve/sendModule')

router.post('/', function (req, res, next) {
  sendModule().then(() => {
    res.json({ status: true, message: '保存成功' });
  }).catch((err) => {
    res.json({ status: false, message: err });
  })
});

module.exports = router;
