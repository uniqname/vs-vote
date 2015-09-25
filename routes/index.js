var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', { title: 'vs Vote' });
});

/* GET weather page. */
router.get('/weather', function(req, res) {
  var sans = req.query.sans;

  if (sans) {
    if (sans.find(i => i === 'templates')) {
      res.render('weather-sans-imports-shadowDOM-templates', { });
    } else if (sans.find(i => i === 'shadowDOM')) {
      res.render('weather-sans-imports-shadowDOM', { });
    } else if (sans.find(i => i === 'imports')) {
      res.render('weather-sans-imports', { });
    } else {
      res.render('weather', { });
    }
  } else {
    res.render('weather', { });
  }

});

router.get('/demos', function (req, res) {
    res.render('demos', {});
});


module.exports = router;
