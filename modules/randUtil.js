var getRandInt = function(min, max) {
	return Math.floor(Math.random() * max + min);
};

var getRandSample = function(arr, size) {
	var copyArr = arr.slice(0);
	var sample = [];
	while (copyArr.length > 0 && sample.length < size) {
		var randInt = getRandInt(0, copyArr.length);
		sample.push(copyArr.splice(randInt, 1)[0]);
	}
	
	return sample;
};

var shuffle = function(arr) {
	return getRandSample(arr, arr.length);
};

exports.getRandInt = getRandInt;
exports.getRandSample = getRandSample;
exports.shuffle = shuffle;