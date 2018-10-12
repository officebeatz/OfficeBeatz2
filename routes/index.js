var express = require('express');
var router = express.Router();
var utils = require('./utils');
/**
 * GET home page.
 */
router.get('/', function(req, res, next) {
  utils.getRandomFile().then(function(result){
    res.render('index', { title: 'OfficeBeatZ', link: result });
  })
});

/**
 * POST Endpoint for looping request
 */
router.post('/api/next', function(req, res, next){
  utils.getRandomFile().then(function(result){
    res.send(result);
  })
})
module.exports = router;