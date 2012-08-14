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
		if (req.params.num) {
			var situations = randUtil.getRandSample(docs, req.params.num);
		} else {
			var situations = docs;
		}
		
		var jsonSituations= JSON.stringify(situations);
		res.setHeader('Content-Type', 'text/json');
		res.send(jsonSituations);
	});
};

exports.save = save;
exports.list = list;