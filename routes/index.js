var dal = require('../modules/dal.js');

exports.index = function(req, res) {
	dal.getAllImgs(function(imgs) {
		dal.getSituations(function(situations) {
			var params = {
				'title' : 'lux * admin',
				'appname' : 'lux',
				'situations' : situations,
				'imgs' : imgs
			};
			res.render('index', params);
		});
	});
};