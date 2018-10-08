var express = require('express');
var router = express.Router();
var utils = require('./utils');
/**
 * GET home page.
 */
router.get('/', function(req, res, next) {
  utils.getRandomFile().then(function(result){
    res.render('index', { title: 'Employee Wellness Project', link: result });
  })
});
module.exports = router;