var dal = require('../modules/dal.js');
var randUtil = require('../modules/randUtil.js');

var save = function(req, res) {
	dal.save('situations', req.body);
	var objResponse = {success : true};
	res.setHeader('Content-Type', 'text/json');
	res.send(JSON.stringify(objResponse));
};

var list = function(req, res) {
	dal.getSituations(function(docs) {
		var sample = randUtil.getRandSample(docs, req.params.num);
		
		var jsonSample= JSON.stringify(sample);
		res.setHeader('Content-Type', 'text/json');
		res.send(jsonSample);
	});
};

exports.save = save;
exports.list = list;