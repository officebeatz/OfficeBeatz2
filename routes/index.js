var express = require('express');
var router = express.Router();
var utils = require('./utils');
var audioLoader=require('./audioLoader');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Employee Wellness Project', buffer: utils.getRandomFile() });
});
audioLoader.audioPlay();
module.exports = router;
