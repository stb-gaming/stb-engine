
// //createGameLoop();
// 
// const world = createState("world");
// const balls = createGroup();
// const ball1 = createSprite("ball.png",balls)
// 
// const ball2 = createSprite("ball.png",balls)
// 
// world.spawn = () =>{
// console.log("ok")
// balls.x = balls.y = 0
// 	ball1.x = 10;
// 	ball1.y = 10;
// 	ball2.x = 500;
// 	ball2.y = 300;
// 	
// }
// 
// // world.tick = dt=>(balls.x+=.3*dt)
// world.update = dt =>{
// //console.log("h")
// 
// 
// 	const move = dt*2;
// 	if(keyDown("arrowup")) balls.y-=move;
// 	if(keyDown("arrowdown")) balls.y+=move;
// 	if(keyDown("arrowleft")) balls.x-=move;
// 	if(keyDown("arrowright")) balls.x+=move;
// 	if(keyDown(" ")) setState("test");
// 	if(keyDown("esc")) setState("menu");
// 
// }
// 
// createMenu()
// 
// console.log(game)







const menu = createMenu()
menu.addOption(createText("Hello",null),()=>console.log("hello"));
menu.addOption(createText("World",null),()=>console.log("world"));
menu.addOption(createText("Foo",null),()=>console.log("foo"));
menu.addOption(createText("Bar",null),()=>console.log("bar"));
menu.addOption(createText("Face",null),()=>console.log("face"));


const text = createText("Press select to continue")
text.y = menu.container.height + 100

menu.state.update = () =>{
	if(keyReleased(SKY_REMOTE.select)) {
		setState("world")
	}
}

const world = createState("world");


const ball = createSprite("ball.png",world)

world.update = dt =>{
	ball.x += getArrowX()*dt*5
	ball.y += getArrowY()*dt*5
}
