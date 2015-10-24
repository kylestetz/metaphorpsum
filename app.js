// -----------------------------------------------
//   LOREM METAPHORPSUM: a generator of metaphor
// -----------------------------------------------
// created by Kyle Stetz -> kylestetz@gmail.com
// and released under the MIT license.
// -----------------------------------------------

var express = require('express')
  , routes = require('./routes')
  , indexRoutes = require('./routes/index')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon('public/favicon.ico'));
// you'll want to uncomment this if you're developing locally.
// app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
  app.use(express.cookieParser('metaphorpsum'));
  app.use(express.session());
app.use(app.router);
  app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
