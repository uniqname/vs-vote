const express = require('express'),
      P = require('bluebird'),
      request = require('request'),
      Flickr = P.promisifyAll(require('flickrapi')),

      config = require('../get-config')(),
      votes = require('./votes'),

      router = express.Router(),

      flickrOptions = {
        api_key: config['flickr-api_key'],
        secret: config['flickr-secret']
      };

Flickr.tokenOnlyAsync(flickrOptions).then(function (flickr) {

    // we can now use "flickr" as our API object
    router.get('/:contender', function(req, res) {
        var search = P.promisify(flickr.photos.search);

        search({
            tags: decodeURIComponent(req.params.contender),
            page: 1,
            per_page: 1
        }).then(function (result) {
            var img = result.photos.photo[0];
                url = `https://farm${img.farm}.staticflickr.com/${img.server}/${img.id}_${img.secret}.jpg`;
            request.get(url).pipe(res);
        }).catch(function (err) {
            console.log(err);
        });
    });

}).catch(function (err) {
    console.log(err);
});

router.get('/', function(req, res) {
    res.send('respond with a resource');
});

module.exports = router;
