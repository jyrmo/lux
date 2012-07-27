var dal = require('../modules/dal.js');
var fs = require('fs');

var img = function(req, res) {
	var render = function(doc) {
		res.writeHead(200, {'Content-Type' : 'image/jpeg'});
		res.write(doc.fullsize.value(), 'binary');
		res.end();
	};
	dal.getImgById(req.params.id, render);
};

var thumb = function(req, res) {
	var render = function(doc) {
		res.writeHead(200, {'Content-Type' : 'image/jpeg'});
		res.write(doc.thumbnail.value(), 'binary');
		res.end();
	};
	
	dal.getImgById(req.params.id, render);
};

exports.img = img;
exports.thumb = thumb;