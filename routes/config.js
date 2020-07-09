var express = require('express');
var router = express.Router();
var { readFileSync } = require('fs');
var {join} =require('path')

router.post('/', function (req, res, next) {
  const config = JSON.parse(readFileSync(join(__dirname, '../config.json')));
  res.json(config);
  res.end();
});


module.exports = router;
