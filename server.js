var fs = require('fs');
var path = require('path');
var express = require('express');
var request = require('request');
var url = require('url');

var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/plays', function(req, res) {
  var apiServerHost = "https://www.boardgamegeek.com/xmlapi2/plays?"
  var url_parts = url.parse(req.url, false);
  var bggurl = apiServerHost + url_parts.query;
  req.pipe(request(bggurl)).pipe(res);
});

app.get('/things', function(req, res) {
  var apiServerHost = "https://www.boardgamegeek.com/xmlapi2/things?"
  var url_parts = url.parse(req.url, false);
  var bggurl = apiServerHost + url_parts.query;
  req.pipe(request(bggurl)).pipe(res);
});

app.listen(app.get('port'), function() {
  console.log('Server started on: ' + app.get('port'));
});