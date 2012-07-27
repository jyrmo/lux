var fs = require('fs'),
	path = require('path');

var dal = require('../modules/dal.js');
var imgUtil = require('../modules/imgUtil.js');

var upload = function(req, res) {
	var filePath = req.files.img.path;
	
	// Compose doc.
	var splitRegex = new RegExp(' *, *');
	var doc = {
		type : req.files.img.type,
		tags : req.body.tags.split(splitRegex)
	};
	
	var tempfilePath = path.resolve('tmp/' + req.files.img.name);
	// Create resized versions.
	imgUtil.resize(filePath, tempfilePath, 450, 280, function(err, stdout, stderr) {
		fs.readFile(tempfilePath, function(err, data) {
			doc.fullsize = data;
			fs.unlink(tempfilePath, function() {
				imgUtil.resize(filePath, tempfilePath, 200, 124, function(err, stdout, stderr) {
					fs.readFile(tempfilePath, function(err, data) {
						doc.thumbnail = data;
						fs.unlink(tempfilePath, function() {
							fs.readFile(filePath, function(err, data) {
								doc.original = data;
								
								// Save doc in db.
								dal.saveImg(doc);
								
								// Redirect.
								res.redirect('/');
							});
						});
					});
				});
			});
		});
	});
};

exports.upload = upload;