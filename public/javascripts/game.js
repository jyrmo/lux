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
	timeout : null,
	curTime : 0,
	
	update : function() {
		$('#time').html(++time.curTime);
		time.timeout = setTimeout('time.update()', 1000);
	},
	
	stop : function() {
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
				time.update();
			},
			error : function(jqXHR, textStatus, errorThrown) {
				messenger.display('Error loading situations: ' + errorThrown);
			}
		});
	},
	
	checkAnswer : function(posNum) {
		var curSituation = game.situations[game.idxSituation];
		var imgNum = game.mapPosImgNum[posNum];
		game.points += parseFloat(curSituation['img' + imgNum].points);
		$('#points').html(game.points + '/' + (game.idxSituation + 1));
		var isCorrect = parseFloat(game.points) == 1;
		game.notifyAnswer(imgNum, isCorrect);
		
		game.nextSituation();
	},
	
	notifyAnswer : function(imgNum, isCorrect) {
		var borderColor = isCorrect ? '#40f040' : '#f04040';
		$('#img-' + imgNum).css('border-color', borderColor);
		$('#img-' + imgNum).animate(
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
			// TODO: Save stats to DB.
			
			time.stop();
			messenger.display('Game over');
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