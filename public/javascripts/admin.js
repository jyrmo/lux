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
		if (searchTerm == '') {
			$('#images img').show();
		} else {
			for (var i in imgs) {
				for (var j in imgs[i].tags) {
					if (imgs[i].tags[j].match(searchTerm) != null) {
						$('#' + imgs[i]._id).show();
						break;
					} else {
						$('#' + imgs[i]._id).hide();
					}
				}
			}
		}
	}
};

var imgSelection = {
	selectedImgIds : {
		'1' : null,
		'2' : null,
		'3' : null,
		'4' : null
	},
	
	init : function() {
		$('#images img').click(function() {
			imgSelection.select($(this).attr('id'));
		});
		
		$('div.situation-image > img.icon-remove').click(function() {
			var slotId = $(this).parent().attr('id');
			var slotIdx = slotId.substring(3);
			imgSelection.removeImg(slotIdx);
		});
		
		$('#situation-save').click(imgSelection.saveSituation);
	},
	
	select : function(id) {
		var slotIdx = 1;
		var foundSlot = false;
		while (slotIdx < 5 && !foundSlot) {
			foundSlot = imgSelection.selectedImgIds['' + slotIdx] == null;
			if (foundSlot) {
				imgSelection.selectedImgIds['' + slotIdx] = id; 
				$('#img' + slotIdx).css('background-image', 'url("/thumb/' + id + '")');
				$('#img' + slotIdx + ' > img.icon-remove').show();
			}
			
			slotIdx++;
		}
	},
	
	removeImg : function(slotIdx) {
		imgSelection.selectedImgIds['' + slotIdx] = null;
		$('#img' + slotIdx).css('background-image', 'none');
		$('#img' + slotIdx + '> img.icon-remove').hide();
	},
	
	saveSituation : function() {
		var situation = {
				'description' : $('#situation-description').val(),
				'img1' : {
					'id' : imgSelection.selectedImgIds['1'],
					'points' : $('#img1-val').val()
				},
				'img2' : {
					'id' : imgSelection.selectedImgIds['2'],
					'points' : $('#img2-val').val()
				},
				'img3' : {
					'id' : imgSelection.selectedImgIds['3'],
					'points' : $('#img3-val').val()
				},
				'img4' : {
					'id' : imgSelection.selectedImgIds['4'],
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
		$('.situation-image img.icon-remove').hide();
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