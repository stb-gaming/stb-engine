import {Sprite,Application} from 'pixi.js'
let app;

export function createRenderer() {
	if(!app) {
		app = new Application({resizeTo:window})
		globalThis.__PIXI_APP__ = app;
		document.body.appendChild(app.view)
	}
	return app
}

export function createSprite(url) {
	createRenderer();
	//await Assets.load(url);
	const sprite  = Sprite.from(url);
	app.stage.addChild(sprite)
	return sprite;
}
