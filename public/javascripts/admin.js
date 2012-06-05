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

$(document).ready(function() {
	section.init('section-header');
	tagSearch.init();
});