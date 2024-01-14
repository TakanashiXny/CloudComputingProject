var express = require('express');
var router = express.Router();
var mysql = require("../mysql.js");
require('date-utils');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/process_get', function(request, response) {
  // sql字符串和参数
  var fetchSql = "select title, source_name, url, publish_date, keywords " +
      "from fetches where " + request.query.way1 + " like '%" + request.query.title1 + "%' " +
      request.query.option + " " + request.query.way2 + " like '%" + request.query.title2 + "%' order by " + request.query.index;

  if (request.query.order === "descend") {
    fetchSql += " desc";
  }
      // "select url, source_name, title, author, publish_date " +
      // "from fetches where title like '%" + request.query.title + "%'";
  mysql.query(fetchSql, function(err, result, fields) {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    result.forEach(eachNews => {
      eachNews.publish_date = eachNews.publish_date.toFormat("YYYY-MM-DD");
    });
    response.write(JSON.stringify(result));
    response.end();
  });
});


router.get('/time_series_get', function(request, response) {
  // sql字符串和参数
  var fetchSql = "select * " +
      "from fetches where keywords like '%" + request.query.keywords + "%' or " +
      "content like '%" + request.query.keywords + "%' or " +
      "title like '%" + request.query.keywords + "%' order by publish_date";
  mysql.query(fetchSql, function(err, result, fields) {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    result.forEach(eachNews => {
      eachNews.publish_date = eachNews.publish_date.toFormat("YYYY-MM-DD");
    });
    response.write(JSON.stringify(result));
    response.end();
  });
});

// 词云
router.get('/word_cloud_get', function(request, response) {
  // sql字符串和参数
  var fetchSql = "select keywords from fetches";
  mysql.query(fetchSql, function(err, result, fields) {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result));
    response.end();
  });
});
module.exports = router;
