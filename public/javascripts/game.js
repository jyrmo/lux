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
	idxSituation : 0,
	
	init : function() {
		messenger.display('Loading situations.');
		
		// TODO: Count right and wrong answers.
		$('div.img').click(game.nextSituation);
		
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
	
	nextSituation : function() {
		if (game.idxSituation < game.situations.length) {
			var curSituation = game.situations[game.idxSituation++];
			$('#situation-description').html('<p>' + curSituation.description + '</p>');
			// TODO: Randomize imgs.
			$('#img-1').css('background-image', 'url("/img/' + curSituation.img1.id + '")');
			$('#img-2').css('background-image', 'url("/img/' + curSituation.img2.id + '")');
			$('#img-3').css('background-image', 'url("/img/' + curSituation.img3.id + '")');
			$('#img-4').css('background-image', 'url("/img/' + curSituation.img4.id + '")');
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