import {onEvent} from "./events.js";

let eventsSetup = false;
const input = {
	down:new Set,
	press:new Set,
	release:new Set
}

const SKY_REMOTE = {
	up:["i","arrowup"],
	down:["k","arrowdown"],
	left:["j","arrowleft"],
	right:['l','arrowright'],
	select:[' ','enter'],
	backup:'backspace',
	red:['q'],
	green:['w'],
	yellow:['e'],
	blue:['r'],
	help:['t'],
}

function updateDown({type,key}) {
	switch(type) {
		case "keydown":
			input.down.add(key);
			input.press.add(key);
		break;
		case "keyup":
			input.down.delete(key);
			input.release.add(key);
		break;
	}
	
}

function refreshInputs() {
	input.press.clear()
	input.release.clear();
}

function checkInput() {
	if(!eventsSetup){
		eventsSetup = true;
		document.addEventListener('keydown',updateDown)
		document.addEventListener('keyup',updateDown)
		onEvent("frameEnd",refreshInputs)
		console.debug("Attached inputs")
		
	}
}

export function buttonDown(button) {
	checkInput();
	return SKY_REMOTE.hasOwnProperty(button)&&
			SKY_REMOTE[button].some(key=>input.down.has(key))
}
export function buttonPressed(button) {
	checkInput();
	return SKY_REMOTE.hasOwnProperty(button)&&
			SKY_REMOTE[button].some(key=>input.press.has(key))
}
export function buttonReleased(button) {
	checkInput();
	return SKY_REMOTE.hasOwnProperty(button)&&
			SKY_REMOTE[button].some(key=>input.release.has(key))
}
