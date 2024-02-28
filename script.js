
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
// if(keyDown("w"))console.log("hello")
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
// 


const ball = createEntity("ball.png")

game.update = dt =>{
	ball.x += (keyDown("arrowright")-keyDown("arrowleft"))*dt*5
	ball.y += (keyDown("arrowdown")-keyDown("arrowup"))*dt*5
}


//const world = createState("world");
