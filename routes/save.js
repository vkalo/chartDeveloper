var { exportChart } = require('../serve/outChart');
var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
  exportChart('/Users/likairui/Desktop/demos/chartDeveloper/out/');
  res.send('respond with a save');
});

module.exports = router;
