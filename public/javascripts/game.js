goog.provide('lux');

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.fill.Stroke');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');

lux.start = function() {
	// TODO: Add start and game over scenes.
	
	var director = new lime.Director(document.body, 1524, 768),
		sceneGame = new lime.Scene(),
		desc = new lime.Label().setAnchorPoint(0, 0).setPosition(10, 10)
			.setSize(912, 35).setText('Situation desc [PH]')
			.setFill(200, 100, 0, .5),
		img1 = new lime.Sprite().setAnchorPoint(0, 0).setPosition(10, 55)
			.setSize(452, 282).setFill(200, 100, 0, 1).setStroke('#a0f0a0'),
		img2 = new lime.Sprite().setAnchorPoint(0, 0).setPosition(472, 55)
			.setSize(452, 282).setFill(200, 100, 0, 1).setStroke('#a0f0a0'),
		img3 = new lime.Sprite().setAnchorPoint(0, 0).setPosition(10, 347)
			.setSize(452, 282).setFill(200, 100, 0, 1).setStroke(100, 200, 100, 1),
		img4 = new lime.Sprite().setAnchorPoint(0, 0).setPosition(472, 347)
			.setSize(452, 282).setFill(200, 100, 0, 1).setStroke(new lime.fill.Stroke(1, '#a0f0a0')),
		stats = new lime.Sprite().setAnchorPoint(0, 0).setPosition(932, 10)
			.setSize(200, 619).setFill(200, 250, 200, .7),
		pointsLabel = new lime.Label().setAnchorPoint(0, 0).setPosition(10, 10)
			.setSize(100, 30).setText('Points'),
		pointsValue = new lime.Label().setAnchorPoint(0, 0).setPosition(110, 10)
			.setSize(100, 30).setText('0'),
		timeLabel = new lime.Label().setAnchorPoint(0, 0).setPosition(10, 45)
			.setSize(100, 30).setText('Time'),
		timeValue = new lime.Label().setAnchorPoint(0, 0).setPosition(110, 45)
			.setSize(100, 30).setText('0')
		;
	
	stats.appendChild(pointsLabel);
	stats.appendChild(pointsValue);
	stats.appendChild(timeLabel);
	stats.appendChild(timeValue);
	
	sceneGame.appendChild(desc);
	sceneGame.appendChild(img1);
	sceneGame.appendChild(img2);
	sceneGame.appendChild(img3);
	sceneGame.appendChild(img4);
	sceneGame.appendChild(stats);

	director.makeMobileWebAppCapable();

	// add some interaction
//	goog.events.listen(target, [ 'mousedown', 'touchstart' ], function(e) {
//
//		// animate
//		target.runAction(
//				new lime.animation.Spawn(
//						new lime.animation.FadeTo(.5).setDuration(.2),
//						new lime.animation.ScaleTo(1.5).setDuration(.8)
//				)
//		);
//
//		title.runAction(new lime.animation.FadeTo(1));
//
//		// let target follow the mouse/finger
//		e.startDrag();
//
//		// listen for end event
//		e.swallow([ 'mouseup', 'touchend' ], function() {
//			target.runAction(new lime.animation.Spawn(
//					new lime.animation.FadeTo(1),
//					new lime.animation.ScaleTo(1),
//					new lime.animation.MoveTo(512, 384)
//			));
//
//			title.runAction(new lime.animation.FadeTo(0));
//		});
//
//	});

	// set current scene active
	director.replaceScene(sceneGame);

};

// this is required for outside access after code is compiled in
// ADVANCED_COMPILATIONS mode
goog.exportSymbol('lux.start', lux.start);
