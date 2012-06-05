var dal = require('../modules/dal');

var save = function(req, res) {
	dal.save('situations', req.body);
	var objResponse = {success : true};
	res.setHeader('Content-Type', 'text/json');
	res.send(JSON.stringify(objResponse));
};

var list = function(req, res) {
	dal.getSituations(req.params.num, function(docs) {
		var jsonDocs = JSON.stringify(docs);
		res.setHeader('Content-Type', 'text/json');
		res.send(jsonDocs);
	});
};

exports.save = save;
exports.list = list;