
/**
 * Module dependencies.
 */
var express = require('express'),
	form = require('util').format,
	
	routes = require('./routes'),
	upload = require('./routes/upload'),
	img = require('./routes/img');
	situation = require('./routes/situation');

var app = module.exports = express.createServer();

app.use(express.bodyParser());

// Configuration

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.post('/upload', upload.upload);
app.get('/img/:id', img.img);
app.get('/thumb/:id', img.thumb);
app.post('/situation', situation.save);
app.get('/situations/:num', situation.list);

app.listen(3000, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
