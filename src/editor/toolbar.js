//import {onEvent} from '../engine/events'

function createSpriteBtn() {
	const url = "assets/img/ball.png"||prompt("Enter sprite url")

	createSprite(url)
}
document.addEventListener("ready",()=>{
	
	document.querySelector("#createSprite").addEventListenter("click",createSpriteBtn)

	
})

//onEvent("start",()=>{
	onEvent("update",delta=>{
			document.querySelector("#fps").innerText = `${Math.round(1/delta)} FPS`
	})
//)
