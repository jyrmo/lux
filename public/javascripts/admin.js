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

var situationEdit = {
	mapSituationIdSituationIdx : {},
	
	situationId : null,
	
	selectedImgIds : {
		'1' : null,
		'2' : null,
		'3' : null,
		'4' : null
	},
	
	init : function() {
		for (var i = 0; i < situations.length; i++) {
			situationEdit.mapSituationIdSituationIdx[situations[i]._id] = i;
		}
		
		$('#images img').click(function() {
			situationEdit.selectImg($(this).attr('id'));
		});
		
		$('div.situation-image > img.icon-remove').click(function() {
			var slotId = $(this).parent().attr('id');
			var slotIdx = slotId.substring(3);
			situationEdit.removeImg(slotIdx);
		});
		
		$('#situation-save').click(situationEdit.saveSituation);
		
		$('button.edit-situation').click(function() {
			situationEdit.reset();
			var situationId = $(this).parent().parent().attr('id');
			situationEdit.editSituation(situationId);
		});
	},
	
	editSituation : function(situationId) {
		situationEdit.situationId = situationId;
		var curSituation = situations[situationEdit.mapSituationIdSituationIdx[situationId]];
		$('#situation-description').val(curSituation.description);
		for (var i = 1; i <= 4; i++) {
			situationEdit.selectImg(curSituation['img' + i].id);
			$('#img' + i + '-val').val(curSituation['img' + i].points);
		}
		$('#create-situation-container > div.section').show();
	},
	
	selectImg : function(id) {
		var slotIdx = 1;
		var foundSlot = false;
		while (slotIdx < 5 && !foundSlot) {
			foundSlot = situationEdit.selectedImgIds['' + slotIdx] == null;
			if (foundSlot) {
				situationEdit.selectedImgIds['' + slotIdx] = id; 
				$('#img' + slotIdx).css('background-image', 'url("/thumb/' + id + '")');
				$('#img' + slotIdx + ' > img.icon-remove').show();
			}
			
			slotIdx++;
		}
	},
	
	removeImg : function(slotIdx) {
		situationEdit.selectedImgIds['' + slotIdx] = null;
		$('#img' + slotIdx).css('background-image', 'none');
		$('#img' + slotIdx + '> img.icon-remove').hide();
	},
	
	saveSituation : function() {
		var situation = {
			'description' : $('#situation-description').val(),
			'img1' : {
				'id' : situationEdit.selectedImgIds['1'],
				'points' : $('#img1-val').val()
			},
			'img2' : {
				'id' : situationEdit.selectedImgIds['2'],
				'points' : $('#img2-val').val()
			},
			'img3' : {
				'id' : situationEdit.selectedImgIds['3'],
				'points' : $('#img3-val').val()
			},
			'img4' : {
				'id' : situationEdit.selectedImgIds['4'],
				'points' : $('#img4-val').val()
			}
		};
		if (situationEdit.situationId !== null) {
			situation._id = situationEdit.situationId;
		}
		
		$.ajax({
			url : '/situation',
			type : 'post',
			cache : false,
			data : situation,
			success : function(data, textStatus, jqXHR) {
				situationEdit.reset();
				situationList.update();
			}
		});
	},
	
	reset : function() {
		$('.situation-image').css('background-image', 'none');
		$('.situation-image img.icon-remove').hide();
		$('.situation-image-container input').val('');
		$('#situation-description').val('');
		situationEdit.selectedImgIds = {
			'1' : null,
			'2' : null,
			'3' : null,
			'4' : null
		};
		situationEdit.situationId = null;
	}
};

var situationList = {
	update : function() {
		$.ajax({
			url : '/situations',
			type : 'get',
			cache : false,
			success : function(data, textStatus, jqXHR) {
				$('#situations').empty();
				var html;
				var doc;
				for (var i = 0; i < data.length; i++) {
					doc = data[i];
					html = '<div class="situation" id="' + doc._id +'">' +
							'<div class="edit-remove">' +
							'<button class="edit-situation" type="button">Edit</button>' +
							'</div>' +
							'<p>' + doc.description + '</p>' +
							'<img src="/thumb/' + doc.img1.id + '" />' +
							'<img src="/thumb/' + doc.img2.id + '" />' +
							'<img src="/thumb/' + doc.img3.id + '" />' +
							'<img src="/thumb/' + doc.img4.id + '" />' +
							'</div>';
					$('#situations').append(html);
				}
				
				$('button.edit-situation').click(function() {
					situationEdit.reset();
					var situationId = $(this).parent().parent().attr('id');
					situationEdit.editSituation(situationId);
				});
			}
		});
	}
};

$(document).ready(function() {
	section.init('section-header');
	tagSearch.init();
	situationEdit.init();
});