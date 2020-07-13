var express = require('express');
var router = express.Router();
var request = require("request");


router.get('/', function (req, res, next) {
  const url = decodeURIComponent(req.query.url);

  //get请求
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
      res.end();
    }
  });
});

module.exports = router;
