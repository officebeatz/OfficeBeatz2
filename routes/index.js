var express = require('express');
var router = express.Router();
var utils = require('./utils');
/**
 * GET home page.
 */
router.get('/', function (req, res, next) {
  var auth = req.session.hasAccess && req.session.hasAccess===true && new Date(req.session.expire_date) >= new Date();
  if (auth) {
    //res.render("access-denied", {title: 'OfficeBeatz',message: 'Access granted'});

    //Commented out for demo purposes
    utils.getRandomFile().then(function (result) {
      res.render('index', {title: 'OfficeBeatZ', link: result});
    })

  } else {
    res.redirect("/authenticate/");
  }
});

/**
 * POST Endpoint for looping request
 */
router.post('/api/next', function (req, res, next) {
  utils.getRandomFile().then(function (result) {
    res.send(result);
  })
});

/**
 * POST Endpoint for getting specific song
 */
router.post('/api/song', function (req, res, next) {
  utils.getSong(req.get('song')).then((result) => {
    res.send(result);
  })
});

/**
 * POST Endpoint for getting genre list
 */
router.post('/api/genres', function (req, res, next) {
  utils.getGenresList().then(function (result) {
    res.send(result);
  })
});

/**
 * GET Endpoint for webhook
 */
router.get('/api/webhook', function(req, res, next) {
  utils.updateDBX().then(() => {
      res.sendStatus(200);
  });
});

/**
 * GET if user has access
 */
router.get('/authenticate/:key?', function(req, res, next){
  var auth1 = req.session.hasAccess && req.session.hasAccess===true;
  var auth2 = req.session.expire_date && new Date(req.session.expire_date) >= new Date();

  if (req.params.key && req.params.key.length > 0) {
    req.session.fire_key = req.params.key;
    utils.hasValidAccess(req).then(function(has_access) {
      if (has_access===0)
      {
        res.redirect("/");
      }
      else if (has_access===1) {
        res.render("access-denied", {title: 'OfficeBeatZ', message: 'You do not have access to this site'});
      }
      else {
        res.render("access-denied", {title: 'OfficeBeatZ', message: 'Your access has expired'});
      }
    });
  }
  else {
    if (auth1 && auth2)
    {
      res.redirect("/");
    }

    else if (auth1 && !auth2)
    {
      res.render("access-denied", {title: 'OfficeBeatZ', message: 'Your access has expired'});
    }
    else {
      res.render("access-denied", {title: 'OfficeBeatZ', message: 'You do not have access to this site'});
    }
  }
});

module.exports = router;
