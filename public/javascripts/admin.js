var section = {
	init: function (className) {
		$('.' + className).click(function() {
			$(this).next().slideToggle('fast');
		});
	}
};

$(document).ready(function() {
	section.init('section-header');
});