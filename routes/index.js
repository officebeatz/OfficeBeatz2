var express = require('express');
var router = express.Router();
var utils = require('./utils');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Employee Wellness Project' });
});

module.exports = router;
