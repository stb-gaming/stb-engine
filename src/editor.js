const ASSETS = "assets/";
const IMG = `${ASSETS}img/`
const canvasConatainerer = document.querySelector("#canvas-container")
const canvas = document.querySelector("canvas")
const app = new PIXI.Application({resizeTo:canvasConatainerer,hello:true,view:canvas})
let ball = PIXI.Sprite.from(`${IMG}ball.png`);
ball.x = app.screen.width / 2;
ball.y = app.screen.height / 2;
ball.anchor.set(0.5);
app.stage.addChild(ball)
 app.ticker.add((delta) => {
 ball.rotation += delta*.01
 })
