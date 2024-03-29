import { onEvent } from "./events.js";
import { game } from './game.js';

const SKY_REMOTE = {
	up: ["arrowup", "i",],
	down: ["arrowdown", "k",],
	left: ["arrowleft", "j",],
	right: ['arrowright', 'l',],
	select: [' ', 'enter'],
	backup: ['backspace'],
	red: ['q'],
	green: ['w'],
	yellow: ['e'],
	blue: ['r'],
	help: ['t'],
}


if (Object.hasOwn(globalThis, "STB_EDITOR")) {
	const form = {};
	for (const btn in SKY_REMOTE) {
		const value = SKY_REMOTE[btn]
		form[btn] = {
			type: "text",
			value: value[0],
			readonly: true,
			events: {
				focus: e => {
					if (input.pause) return
					e.preventDefault()
					input.pause = true;
					e.target.value = "Input..."
					STB_EDITOR.oneTimeEventListener(document, "keyup", e => {
						e.target.value = e.key;
						value[0] = e.key
						input.pause = false;
					})
					return false;
				}
			}
		}
	}
	STB_EDITOR.createSystem({
		// System ID
		id: "input",
		//System Icon
		// img:"https://avatars.githubusercontent.com/u/583231",
		/// System Name
		title: "Sky Remote",
		// System Description
		summary: "Sky Remote",
		panel: {
			form
		}
	});
}

let eventsSetup = false;
const input = game.input ??= {
	binds: SKY_REMOTE,
	down: new Set,
	press: new Set,
	release: new Set
}


function inputHandler({ type, key }) {
	key &&= key.toLowerCase()
	switch (type) {
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

function ensureInput() {
	if (!eventsSetup) {
		eventsSetup = true;
		document.addEventListener('keydown', inputHandler)
		document.addEventListener('keyup', inputHandler)
		onEvent("frameEnd", refreshInputs)
		console.debug("Attached inputs")

	}
}

export function buttonDown(button) {
	ensureInput();
	return input.binds.hasOwnProperty(button) &&
		input.binds[button].some(key => input.down.has(key))
}
export function buttonPressed(button) {
	ensureInput();
	return input.binds.hasOwnProperty(button) &&
		input.binds[button].some(key => input.press.has(key))
}
export function buttonReleased(button) {
	ensureInput();
	return input.binds.hasOwnProperty(button) &&
		input.binds[button].some(key => input.release.has(key))
}


export const getArrowX = () => buttonDown("right") - buttonDown("left")
export const getArrowY = () => buttonDown("down") - buttonDown("up")
