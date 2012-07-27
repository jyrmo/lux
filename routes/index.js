var dal = require('../modules/dal.js');

exports.index = function(req, res) {
	dal.getAllImgs(function(docs) {
		res.render('index', {title: 'lux * admin', appname : 'lux', imgs : docs});
	});
};