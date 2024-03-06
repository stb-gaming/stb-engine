import {setupDragging} from './editor/drag'
const getEl = q=>document.querySelector(q);


getEl("#createSprite").addEventListener("click",()=>{
	const url = prompt("SpriteURL","assets/img/ball.png")

	let s = createSprite(url)
	console.log(s)
	setupDragging(s)
	globalThis.sprite = s;
})

const app = createRenderer();
setupDragging(app);

