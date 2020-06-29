var express = require('express');
var router = express.Router();
var {exportFile} = require('../serve/loadChart');

router.post('/', function (req, res, next) {
  exportFile();
  res.send('respond with a save');
});

module.exports = router;
