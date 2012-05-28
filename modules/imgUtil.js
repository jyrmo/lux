var imagemagick = require('imagemagick');

var resize = function(srcPath, dstPath, maxWidth, maxHeight, callback) {
	imagemagick.identify(srcPath, function(err, features) {
		var originalWidth = features.width;
		var originalHeight = features.height;
		var originalRatio = originalWidth / originalHeight;
		
		var targetRatio = maxWidth / maxHeight;
		var width;
		var height;
		if (originalRatio > targetRatio) {
			width = maxWidth;
			height = (width * originalHeight) / originalWidth;
		} else {
			height = maxHeight;
			width = (height * originalWidth) / originalHeight;
		}
		imagemagick.resize({
			'srcPath' : srcPath,
			'dstPath' : dstPath,
			'width' : width,
			'height' : height
		}, callback);
	});
};

exports.resize = resize;