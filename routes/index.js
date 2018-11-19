var express = require('express');
var router = express.Router();
var utils = require('./utils');
/**
 * GET home page.
 */
router.get('/', function (req, res, next) {
  utils.getRandomFile().then(function (result) {
    res.render('index', { title: 'OfficeBeatZ', link: result });
  })
});

/**
 * POST Endpoint for looping request
 */
router.post('/api/next', function (req, res, next) {
  utils.getRandomFile().then(function (result) {
    console.log(result)
    res.send(result);
  })
})

/**
 * POST Endpoint for getting genre list
 */
router.post('/api/genres', function (req, res, next) {
  utils.getGenresList().then(function (result) {
    console.log(result)
    res.send(result);
  })
})

/**
 * GET Endpoint for webhook
 */
router.get('/api/webhook', function(req, res, next){
  utils.updateDBX();
})


module.exports = router;