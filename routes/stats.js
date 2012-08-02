var dal = require('../modules/dal');

var save = function(req, res) {
	dal.save('statistics', req.body);
	var objResponse = {success : true};
	res.setHeader('Content-Type', 'text/json');
	res.send(JSON.stringify(objResponse));
};

exports.save = save;