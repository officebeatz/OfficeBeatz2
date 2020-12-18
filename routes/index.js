var express = require('express');
var router = express.Router();
var utils = require('./utils');
/**
 * GET home page.
 */
router.get('/', function (req, res, next) {
  //Authentication code by Alex Amin Zamani
  var auth = req.session.hasAccess && req.session.hasAccess===true && new Date(req.session.expire_date) >= new Date();
  if (req.session.redirectURL && req.session.redirectURL.length>0)
  {
    res.redirect(req.session.redirectURL);
  }
  else if (auth) {
    //res.render("access-denied", {title: 'OfficeBeatz',message: 'Access granted'});


    //Commented out for demo purposes
    req.session.pageViewDate = new Date();
    //utils.UpdateOffPageViewDiff(req.session.fire_key, req.session.id);

    req.session.save();
    utils.getRandomFile().then(function (result) {
      res.render('index', {title: 'OfficeBeatZ', link: result});
    });


  } else {
    res.redirect("/authenticate/");
  }
});

/**
 * GET shows user when they have been logged out
 * Written by Alex Amin Zamani
 */
router.get('/logout', function (req, res, next) {
  if (req.session.redirectURL && req.session.redirectURL==="/logout")
  {
    res.render("access-denied", {title: 'OfficeBeatz',message: 'You have been logged out. Please use the emailed link to log back in.'});
    req.session.redirectURL = null;
    req.session.save();
  }
  else {
    res.redirect("/");
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
 * POST Endpoint for updating the time they spent on the page
 * Written by Alex Amin Zamani
 */
router.post('/api/timing', function (req, res, next) {
  if (req.session.fire_key)
    utils.updateTime(req.session.fire_key, req.get("timeSpent"));
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
 * Written by Alex Amin Zamani
 */
router.get('/authenticate/:key?', function(req, res, next){
  var auth1 = req.session.hasAccess && req.session.hasAccess===true;
  var auth2 = req.session.expire_date && new Date(req.session.expire_date) >= new Date();

  if (req.params.key && req.params.key.length > 0) {
    req.session.fire_key = req.params.key;
    utils.hasValidAccess(req).then(function(has_access) {
      if (has_access===0)
      {
        utils.logoutAllOtherSessions(req, res);
        utils.checkLogout(req.session.fire_key, req.sessionID);
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
