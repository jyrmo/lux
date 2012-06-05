var section = {
	init : function(className) {
		$('.' + className).click(function() {
			$(this).next().slideToggle('fast');
		});
	}
};

var tagSearch = {
	init : function() {
		$('input[name="tag-search"]').keyup(function(event) {
			tagSearch.search();
		});
	},
	
	search : function() {
		var searchTerm = $('input[name="tag-search"]').val();
		console.log(searchTerm);
	}
};

var imgSelection = {
	selectedImgIds : [],
	
	nextVacant : 1,
	
	init : function() {
		$('#images img').click(function() {
			if (imgSelection.nextVacant < 5) {
				imgSelection.select($(this).attr('id'));
			}
		});
		
		$('#situation-save').click(imgSelection.saveSituation);
	},
	
	select : function(id) {
		$('#img' + imgSelection.nextVacant).css('background-image', 'url("/thumb/' + id + '")');
		imgSelection.selectedImgIds.push(id);
		imgSelection.nextVacant++;
	},
	
	saveSituation : function() {
		var situation = {
				'description' : $('#situation-description').val(),
				'img1' : {
					'id' : imgSelection.selectedImgIds.shift(),
					'points' : $('#img1-val').val()
				},
				'img2' : {
					'id' : imgSelection.selectedImgIds.shift(),
					'points' : $('#img2-val').val()
				},
				'img3' : {
					'id' : imgSelection.selectedImgIds.shift(),
					'points' : $('#img3-val').val()
				},
				'img4' : {
					'id' : imgSelection.selectedImgIds.shift(),
					'points' : $('#img4-val').val()
				}
		};
		
		$.ajax({
			url : '/situation',
			type : 'post',
			cache : false,
			data : situation,
			success : function(data, textStatus, jqXHR) {
				imgSelection.reset();
			}
		});
	},
	
	reset : function() {
		$('.situation-image').css('background-image', 'none');
		$('.situation-image-container input').val('');
		$('#situation-description').val('');
		imgSelection.selectedImgIds = [];
		imgSelection.nextVacant = 1;
	}
};

$(document).ready(function() {
	section.init('section-header');
	tagSearch.init();
	imgSelection.init();
});