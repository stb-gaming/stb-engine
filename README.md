> this is a work in progress

2d game enging created for laymans




create a ball that you can move with arrow keys in a few lines of code
```js
const ball = createEntity("ball.png")

game.update = dt =>{
	ball.x += (keyDown("arrowright")-keyDown("arrowleft"))*dt*5
	ball.y += (keyDown("arrowdown")-keyDown("arrowup"))*dt*5
}
```

![](screenshot.png)
