
/**
 * Module dependencies.
 */

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
// app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
  app.use(express.cookieParser('metaphorpsum'));
  app.use(express.session());
app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/sentences/:number', indexRoutes.validate, indexRoutes.generateSentences);
app.get('/paragraphs/:paragraphs/:sentences', indexRoutes.validate, indexRoutes.generateParagraphs);
app.get('/paragraphs/:paragraphs', indexRoutes.validate, indexRoutes.generateParagraphs);
app.get('/', indexRoutes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
