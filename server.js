var fs = require('fs');
var path = require('path');
var request = require('request');
var url = require('url');
var H = require("hyperweb");
var datastore = require("./datastore").sync;
var bodyParser = require('body-parser');
var parser = require('xml2json');
var sync = require("synchronize");

app = H.blastOff();
datastore.initializeApp(app);



// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    initializeDatastoreOnProjectCreation();
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
  url_parts = url.parse(req.url, true);
  page = parseInt(url_parts.query.page);

  var data = "";
  request
    .get(bggurl)
    .on('data', function(indata) {
      data += indata;
    })
    .on('end', function() {
        var json = parser.toJson(data, {object: true});
        if (typeof json.plays.play == 'undefined') {
          return;
        }
        qty = 0;
        json.plays.play.forEach(function(value, key) {
          qty += parseInt(value.quantity);
        });
        new_user = { user_id: json.plays.userid, 
                     username: json.plays.username, 
                     plays: qty,
                     last_page: page
        };
        sync.fiber(function() {
          users = datastore.get("recent_users");
          current_user = datastore.get(new_user.username);
          if(!current_user)
            current_user = new_user;
          update = false;
          if (new_user.last_page == 1) {
            // overwrite user. so just stick with what we just pulled from the response
            update = true;
            users.unshift(new_user.username);
            datastore.set("recent_users", users.slice(0,10));
          }
          if (current_user.last_page+1 == new_user.last_page) {
            // update new user
            new_user.plays += current_user.plays;
            update = true;
          } // else ignore this because it's out of order..
          
          if (update) {
            datastore.set(new_user.username, new_user);
          }
        });
    })
    .pipe(res);
});

app.get('/things', function(req, res) {
  var apiServerHost = "https://www.boardgamegeek.com/xmlapi2/things?"
  var url_parts = url.parse(req.url, false);
  var bggurl = apiServerHost + url_parts.query;
  req.pipe(request(bggurl)).pipe(res);
});

app.get('/', function(req, res) {
  var recentusers = datastore.get("recent_users");
  users = [];
  recentusers.forEach(function(value, key, recentusers) {
    users.push(datastore.get(value));
  });
  res.render('recent.html', {
    recentusers: users
  });
});

// ------------------------
// DATASTORE INITIALIZATION

function initializeDatastoreOnProjectCreation() {
  if (!datastore.get("initialized")) {
    datastore.set("recent_users", recent_users);
    datastore.set(recent_user.username, recent_user);
    datastore.set("initialized", true);
  }
}

// array of user names (which are also keys)
var recent_users = ["jcopenha"];

// sample user stat
var recent_user = {
  user_id : 1211512,
  username : "jcopenha",
  plays : 18,
  last_page : 0
}