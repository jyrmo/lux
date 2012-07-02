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

var game = {
	numSituations : 10,
	situations : null,
	idxSituation : -1,
	mapPosImgNum : {},
	
	init : function() {
		messenger.display('Loading situations.');
		
		$('div.img').click(function() {
			var divId = $(this).attr('id');
			var arrDivId = divId.split('-');
			var posNum = arrDivId[1];
			game.checkAnswer(posNum);
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
			},
			error : function(jqXHR, textStatus, errorThrown) {
				messenger.display('Error loading situations: ' + errorThrown);
			}
		});
	},
	
	checkAnswer : function(posNum) {
		// TODO: Save points in stats.
		
		var curSituation = game.situations[game.idxSituation];
		var imgNum = game.mapPosImgNum[posNum];
		var points = curSituation['img' + imgNum].points;
		var isCorrect = parseFloat(points) == 1;
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
			// TODO: Randomize imgs.
			$('#img-1').css('background-image', 'url("/img/' + curSituation.img1.id + '")');
			game.mapPosImgNum["1"] = 1;
			$('#img-2').css('background-image', 'url("/img/' + curSituation.img2.id + '")');
			game.mapPosImgNum["2"] = 2;
			$('#img-3').css('background-image', 'url("/img/' + curSituation.img3.id + '")');
			game.mapPosImgNum["3"] = 3;
			$('#img-4').css('background-image', 'url("/img/' + curSituation.img4.id + '")');
			game.mapPosImgNum["4"] = 4;
		} else {
			// TODO Handle this better.
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