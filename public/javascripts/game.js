goog.provide('lux');

goog.require('goog.net.XhrIo');

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Label');
goog.require('lime.Renderer');
goog.require('lime.fill.Image');

lux.messenger = {
	display : function(msg) {
		lux.msg.setText(msg);
	},
	
	flash : function(msg, secs) {
		lux.messenger.display(msg);
		setTimeout('lux.messenger.clear()', 1000 * secs);
	},
	
	add : function(msg) {
		lux.msg.setText(lux.msg.getText() + "\n" + msg)
	},
	
	clear : function() {
		lux.msg.setText('');
	}
};

lux.time = {
	startTime : null,
	gameTime : null,
	timeout : null,
	
	start : function() {
		lux.time.startTime = Math.floor(new Date().valueOf() / 1000);
		lux.time.timeout = setTimeout('lux.time.update()', 1000);
	},
	
	update : function() {
		var curTime = Math.floor(new Date().valueOf() / 1000);
		var elapsedTime = curTime - lux.time.startTime;
		// TODO: UI update.
		lux.time.timeout = setTimeout('lux.time.update()', 1000);
	},
	
	stop : function() {
		var curTime = Math.floor(new Date().valueOf() / 1000);
		lux.time.gameTime = curTime - lux.time.startTime;
		clearTimeout(lux.time.timeout);
	}
};

lux.util = {
	getRandInt : function(min, max) {
		return Math.floor(Math.random() * max + min);
	},
	
	getRandSample : function(arr, size) {
		var copyArr = arr.slice(0);
		var sample = [];
		while (copyArr.length > 0 && sample.length < size) {
			var randInt = lux.util.getRandInt(0, copyArr.length);
			sample.push(copyArr.splice(randInt, 1)[0]);
		}
		
		return sample;
	},
	
	shuffle : function(arr) {
		return lux.util.getRandSample(arr, arr.length);
	}
};

lux.init = function() {
	// Setup UI.
	lux.initUi();
	
	// Show loading message.
	lux.messenger.display('Loading...');

	// Load situations.
	var xhrIo = new goog.net.XhrIo();
	goog.events.listen(xhrIo, 'complete', function() {
		if (xhrIo.isSuccess()) {
			var situations = xhrIo.getResponseJson();
			
			// Clear loading message.
			lux.messenger.clear();
			
			// Start loop.
			lux.loop();
		} else {
			lux.messenger.display('Error loading situations.');
		}
	});
	// TODO: Put number of situations in conf.
	xhrIo.send('/situations/10');
};

lux.loop = function() {
	// TODO
};

lux.end = function() {
	// TODO
};

lux.initUi = function() {
	var director = new lime.Director(document.body, 1920, 1200),
		sceneGame = new lime.Scene().setSize(1920,1200),
		bgImg = new lime.fill.Image('/images/background-wall.jpg'),
		background = new lime.Sprite().setSize(1920, 1200).setFill(bgImg)
			.setAnchorPoint(0, 0),
		frame1 = new lime.Sprite().setFill('/images/raam-1.png')
			.setPosition(685, 760).setAnchorPoint(0, 0),
		frame2 = new lime.Sprite().setFill('/images/raam-2.png')
			.setPosition(1120, 475).setAnchorPoint(0, 0),
		frame3 = new lime.Sprite().setFill('/images/raam-3.png')
			.setPosition(1450, 175).setAnchorPoint(0, 0),
		frame4 = new lime.Sprite().setFill('/images/raam-4.png')
			.setPosition(595, 255).setAnchorPoint(0, 0),
		clock = new lime.Sprite().setFill('/images/clock.png')
			.setPosition(1090, 125).setAnchorPoint(0, 0),
		scoreBoard = new lime.Sprite().setFill('/images/score-board.png')
			.setPosition(115, 250).setAnchorPoint(0, 0),
		msg = new lime.Label().setPosition(950, 50).setAnchorPoint(0, 0)
			.setFontSize(50).setFontColor('#f0f0f0'),
		question = new lime.Label().setPosition(225, 50);
	;
	
	sceneGame.setRenderer(lime.Renderer.CANVAS);
	sceneGame.appendChild(background);
	background.appendChild(frame1);
	background.appendChild(frame2);
	background.appendChild(frame3);
	background.appendChild(frame4);
	background.appendChild(clock);
	background.appendChild(scoreBoard);
	background.appendChild(msg);
	background.appendChild(question);
	
	director.makeMobileWebAppCapable();

	director.replaceScene(sceneGame);
	
	lux.frame1 = frame1;
	lux.frame2 = frame2;
	lux.frame3 = frame3;
	lux.frame4 = frame4;
	lux.clock = clock;
	lux.scoreBoard = scoreBoard;
	lux.msg = msg;
	lux.question = question;
};

lux.start = function() {
	lux.init();
};

goog.exportSymbol('lux.start', lux.start);
