var messenger = {
	element : null,
	
	init : function(selector) {
		messenger.element = $(selector);
	},
	
	wrapMsg : function(msg) {
		var wrappedMsg = '<p>' + msg + '</p>';
		
		return wrappedMsg;
	},
	
	display : function(msg) {
		var html = messenger.wrapMsg(msg);
		messenger.element.html(html);
		messenger.element.show();
	},
	
	flash : function(msg, secs) {
		messenger.display(msg);
		setTimeout('messenger.clear()', 1000 * secs);
	},
	
	add : function(msg) {
		var html = messenger.wrapMsg(msg);
		messenger.element.append(html);
		messenger.element.show();
	},
	
	clear : function() {
		messenger.element.empty();
		messenger.element.hide();
	}
};

var time = {
	startTime : null,
	gameTime : null,
	timeout : null,
	
	start : function() {
		time.startTime = Math.floor(new Date().valueOf() / 1000);
		time.timeout = setTimeout('time.update()', 1000);
	},
	
	update : function() {
		var curTime = Math.floor(new Date().valueOf() / 1000);
		var elapsedTime = curTime - time.startTime;
		$('#time').html(elapsedTime);
		time.timeout = setTimeout('time.update()', 1000);
	},
	
	stop : function() {
		var curTime = Math.floor(new Date().valueOf() / 1000);
		time.gameTime = curTime - time.startTime;
		clearTimeout(time.timeout);
	}
};

var util = {
	getRandInt : function(min, max) {
		return Math.floor(Math.random() * max + min);
	},
	
	getRandSample : function(arr, size) {
		var copyArr = arr.slice(0);
		var sample = [];
		while (copyArr.length > 0 && sample.length < size) {
			var randInt = util.getRandInt(0, copyArr.length);
			sample.push(copyArr.splice(randInt, 1)[0]);
		}
		
		return sample;
	},
	
	shuffle : function(arr) {
		return util.getRandSample(arr, arr.length);
	}
};

var game = {
	numSituations : 10,
	situations : null,
	idxSituation : -1,
	mapPosImgNum : {},
	points : 0,
	
	init : function() {
		messenger.display('Loading situations.');
		
		$('div.img').click(function() {
			if (game.idxSituation < game.situations.length) {
				var divId = $(this).attr('id');
				var arrDivId = divId.split('-');
				var posNum = arrDivId[1];
				game.checkAnswer(posNum);
			}
		});
		
		$.ajax({
			cache : false,
			type : 'GET',
			url : '/situations/'  + game.numSituations,
			dataType : 'json',
			success : function(data, textStatus, jqXHR) {
				messenger.clear();
				game.situations = data;
				game.nextSituation();
				time.start();
			},
			error : function(jqXHR, textStatus, errorThrown) {
				messenger.display('Error loading situations: ' + errorThrown);
			}
		});
	},
	
	checkAnswer : function(posNum) {
		var curSituation = game.situations[game.idxSituation];
		var imgNum = game.mapPosImgNum[posNum];
		var answerPoints = curSituation['img' + imgNum].points;
		game.points += parseFloat(answerPoints);
		$('#points').html(game.points + '/' + (game.idxSituation + 1));
		var isCorrect = parseFloat(answerPoints) == 1;
		game.notifyAnswer(posNum, isCorrect);
		
		game.nextSituation();
	},
	
	notifyAnswer : function(posNum, isCorrect) {
		var msg = isCorrect ? 'Correct answer.' : 'Wrong answer.';
		messenger.flash(msg, 1);
		
		var borderColor = isCorrect ? '#40f040' : '#f04040';
		$('#img-' + posNum).css('border-color', borderColor);
		$('#img-' + posNum).animate(
			{
				'border-width' : '5px'
			},
			400,
			function() {
				$(this).animate(
					{
						'border-width' : '1px'
					},
					400
				);
				$(this).css('border-color', '#000000');
			}
		);
	},
	
	nextSituation : function() {
		game.mapPosImgNum = {};
		game.idxSituation++;
		if (game.idxSituation < game.situations.length) {
			var curSituation = game.situations[game.idxSituation];
			$('#situation-description').html('<p>' + curSituation.description + '</p>');
			
			// TODO: Randomize imgs better.
			var arrPos = [1, 2, 3, 4];
			var arrPosShuffled = util.shuffle(arrPos);
			var imgIdx = 0;
			var posNum;
			while (arrPosShuffled.length > 0) {
				posNum = arrPosShuffled.shift();
				imgIdx++;
				$('#img-' + posNum).css('background-image', 'url("/img/' + curSituation['img' + imgIdx].id + '")');
				game.mapPosImgNum[posNum] = imgIdx;
			}
		} else {
			time.stop();
			messenger.display('Game over');
			
			// Save stats.
			$.ajax({
				cache : false,
				type : 'POST',
				url : '/stats',
				data : {
					'time' : time.gameTime,
					'points' : game.points
				},
				dataType : 'json',
				success : function(data, textStatus, jqXHR) {
					if (!data.success) {
						messenger.display('Error saving stats.');
					}
				},
				error : function(jqXHR, textStatus, errorThrown) {
					messenger.display('Error saving stats: ' + errorThrown);
				}
			});
		}
	},
	
	createImgHtml : function(id) {
		var html = '<img src="/img/' + id +'" />';
		
		return html;
	}
};

$(document).ready(function() {
	messenger.init('#msg');
	game.init();
});