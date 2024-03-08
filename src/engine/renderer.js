import {Sprite,Application} from 'pixi.js'
let app;

export function createRenderer(options = { resizeTo: window }) {
  if (!app) {
    const isCanvasElement = options instanceof HTMLCanvasElement;
    const hasCanvas = options.canvas instanceof HTMLCanvasElement;

    if (isCanvasElement) {
      options = { view: options };
    } else if (hasCanvas) {
      options.view = options.canvas;
    }

    app = new Application(options);
    globalThis.__PIXI_APP__ = app;
    console.debug("Created app", app);

    const parent = options.resizeTo && !(options.resizeTo instanceof Window) ? options.resizeTo : document.body;
    if (!options.view.parentElement) {
      parent.appendChild(app.view);
    }
  }
  return app;
}

export function createSprite(url) {
	createRenderer();
	//await Assets.load(url);
	const sprite  = Sprite.from(url);
	console.debug("Created Sprite",sprite)
	app.stage.addChild(sprite)

	console.debug("Spawned Sprite into stage",app.stage)
	return sprite;
}
