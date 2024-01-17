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
  var fetchSql = "select Title, UserRating, Genre, Year, Stars " +
      "from animation where " + request.query.way1 + " like '%" + request.query.title1 + "%'";

  mysql.query(fetchSql, function(err, result, fields) {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result));
    response.end();
  });
});

// 年份
router.get('/factor_year', function (request, response) {
  var fetchSql = "select UserRating, Year from animation";

  mysql.query(fetchSql, function (err, result, fields) {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result));
    response.end();
  });

});

// 题材
router.get('/factor_genre', function (request, response) {
  var fetchSql = "select UserRating, Genre from animation";

  mysql.query(fetchSql, function (err, result, fields) {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result));
    response.end();
  });
});


// 明星
router.get('/factor_star', function (request, response) {
  var fetchSql = "select UserRating, Stars from animation";

  mysql.query(fetchSql, function (err, result, fields) {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result));
    response.end();
  });
});

// 词云
router.get('/get_star', function(request, response) {
  // sql字符串和参数
  var fetchSql = "select Title, UserRating, Genre, Year, Stars from animation " +
                  "where Year >= " + request.query.start + ' and Year <= ' + request.query.end +
                  " and Stars like '%" + request.query.name + "%'";
  mysql.query(fetchSql, function(err, result, fields) {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result));
    response.end();
  });
});

router.get('/genre_change', function(request, response) {
  // sql字符串和参数
  var fetchSql = "select Year, UserRating, Genre, Stars from animation where Genre like '%" + request.query.genre + "%'";
  mysql.query(fetchSql, function(err, result, fields) {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result));
    response.end();
  });
});

module.exports = router;
