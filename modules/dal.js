var Db = require('mongodb').Db,
	Server = require('mongodb').Server,
	ReplSetServers = require('mongodb').ReplSetServers,
	ObjectID = require('mongodb').ObjectID,
	Binary = require('mongodb').Binary,
	GridStore = require('mongodb').GridStore,
	Code = require('mongodb').Code,
	BSON = require('mongodb').pure().BSON,
	fs = require('fs');

var db = new Db(
		'lux',
		new Server(
				"127.0.0.1",
				27017,
				{auto_reconnect: false, poolSize: 4}
		),
		{native_parser: false}
);

var save = function(collectionName, doc) {
	db.open(function(err, db) {
		db.collection(collectionName, function(err, collection) {
			collection.save(doc);
			db.close();
		});
	});
};

var saveImg = function(doc) {
	doc.original = new Binary(doc.original);
	doc.fullsize = new Binary(doc.fullsize);
	doc.thumbnail = new Binary(doc.thumbnail);
	save('imgs', doc);
};

var getImgById = function(id, callback) {
	db.open(function(err, db) {
		db.collection('imgs', function(err, collection) {
			var docId = new ObjectID(id);
			collection.findOne({_id : docId}, function(err, doc) {
				callback(doc);
				db.close();
			});
		});
	});
};

exports.save = save;
exports.saveImg = saveImg;
exports.getImgById = getImgById;