goog.provide('lux');

goog.require('goog.net.XhrIo');
goog.require('goog.Uri.QueryData');

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
		lux.timeLabel.setText(elapsedTime);
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
	// Initialize score.
	lux.points = 0;
	
	// Setup UI.
	lux.initUi();
	
	// Show loading message.
	lux.messenger.display('Loading...');
	
	// Load situations.
	var xhrIo = new goog.net.XhrIo();
	goog.events.listen(xhrIo, 'complete', function() {
		if (xhrIo.isSuccess()) {
			lux.situations = xhrIo.getResponseJson();
			lux.numSituation = -1;
			
			// Clear loading message.
			lux.messenger.clear();
			lux.isPlaying = true;
			
			// Start timer.
			lux.time.start();
			
			// Start loop.
			lux.advanceLoop();
		} else {
			lux.messenger.display('Error loading situations.');
		}
	});
	xhrIo.send('/situations/10');
};

lux.frameClicked = function(num) {
	if (!lux.isPlaying) {
		return;
	}
	
	// Update score.
	var situation = lux.situations[lux.numSituation];
	var imgNum = lux.mapPosImgNum[num];
	var answerPoints = situation['img' + imgNum].points;
	lux.points += parseFloat(answerPoints);
	lux.score.setText('Correct: ' + lux.points + '/' + (lux.numSituation + 1));
	
	// Notify user.
	var isCorrect = parseFloat(answerPoints) == 1;
	var msg = isCorrect ? 'Correct' : 'Wrong answer';
	lux.messenger.flash(msg, 1);
	
	// Advance loop.
	lux.advanceLoop();
};

lux.advanceLoop = function() {
	// Get the next situation.
	lux.numSituation++;
	if (lux.numSituation >= lux.situations.length) {
		return lux.end();
	}
	var situation = lux.situations[lux.numSituation];
	
	// Render the question and options.
	lux.question.setText(situation.description);
	
	// TODO: Randomize imgs better.
	lux.mapPosImgNum = [];
	var arrPos = [1, 2, 3, 4];
	var arrPosShuffled = lux.util.shuffle(arrPos);
	var imgIdx = 0;
	var posNum;
	var imgSprite;
	while (arrPosShuffled.length > 0) {
		posNum = arrPosShuffled.shift();
		imgIdx++;
		lux.frames[posNum].setFill('/img/' + situation['img' + imgIdx].id);
		lux.mapPosImgNum[posNum] = imgIdx;
	}
};

lux.end = function() {
	lux.isPlaying = false;
	
	// Stop timer.
	lux.time.stop();
	
	// Notify user.
	setTimeout('lux.messenger.display("Game over")', 2000);
	
	// Save results.
	var xhrIo = new goog.net.XhrIo();
	goog.events.listen(xhrIo, 'complete', function() {
		if (xhrIo.isSuccess()) {
			
		} else {
			lux.messenger.display('Error saving results.');
		}
	});
	var mapResults = new goog.structs.Map({
		time : lux.time.gameTime,
		points : lux.points
	});
	
	var strResults = goog.Uri.QueryData.createFromMap(mapResults).toString();
	xhrIo.send('/stats', 'POST', strResults);
};

lux.initUi = function() {
	// TODO: Change mouse cursor on clickable sprites.
	
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
		question = new lime.Label().setPosition(225, 50).setAnchorPoint(0, 0)
			.setFontSize(50).setFontColor('#f0f0f0'),
		score = new lime.Label().setPosition(100, 100).setAnchorPoint(0, 0)
			.setFontSize(25).setFontColor('#f0f0f0').setText('Correct: 0/0'),
		timeLabel = new lime.Label().setPosition(160, 190).setAnchorPoint(0, 0)
			.setFontSize(30).setFontColor('#101010').setText('0');
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
	scoreBoard.appendChild(score);
	clock.appendChild(timeLabel);
	
	director.makeMobileWebAppCapable();
	
	var interactions = [
		goog.events.EventType.CLICK,
		goog.events.EventType.TOUCHSTART
	];
	goog.events.listen(frame1, interactions, function() {
		lux.frameClicked(1);
	});
	goog.events.listen(frame2, interactions, function() {
		lux.frameClicked(2);
	});
	goog.events.listen(frame3, interactions, function() {
		lux.frameClicked(3);
	});
	goog.events.listen(frame4, interactions, function() {
		lux.frameClicked(4);
	});
	
	director.replaceScene(sceneGame);
	
	lux.frames = [null, frame1, frame2, frame3, frame4];
	lux.msg = msg;
	lux.question = question;
	lux.score = score;
	lux.timeLabel = timeLabel;
};

lux.start = function() {
	lux.init();
};

goog.exportSymbol('lux.start', lux.start);
