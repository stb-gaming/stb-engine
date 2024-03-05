let app;

export function loadCanvas(canvas,resizeTo=window) {
	app = new PIXI.Application({resizeTo:resizeTo,hello:true,view:canvas})
	
	globalThis.__PIXI_APP__ = app;
	
}


export function createSprite(url) {
	
	let ball = PIXI.Sprite.from(url);
	ball.x = app.screen.width / 2;
	ball.y = app.screen.height / 2;
	ball.anchor.set(0.5);
	app.stage.addChild(ball)
	 app.ticker.add((delta) => {
	 ball.rotation += delta*.01
	 })
}
