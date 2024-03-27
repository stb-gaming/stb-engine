"use strict";
import { STB_EDITOR } from './editor/STB_EDITOR'
import "./editor/console";
import { fn, oneTimeEventListener } from './editor/util'

import { getEl, createHTML, htmlTag, getElementPosition, setElementPosition } from "./editor/html";
import { createForm } from './editor/form';
import { createPanel } from './editor/panel';
import "./editor/not-features";
import { createSystem } from "./editor/systems.js";
import { createMenuButton } from "./editor/menubar.js";
import { importGist } from "./editor/gist.js";
import { createBinding } from "./editor/help.js";

/*const createSpriteSchema = {
	url: {
		label: "Sprite URL",
		value: "assets/img/ball.png"
	},
	"": { type: "submit", value: "Create" }
}*/


// getEl("#createSprite").addEventListener("click", () => {
// 	//const url = prompt("SpriteURL","assets/img/ball.png")
//
// 	quickFormPrompt("Sprite URL", createSpriteSchema, {
// 		onSubmit: ({ url }) => {
// 			let s = createSprite(url)
// 			console.log(s)
// 			setupDragging(s)
// 			globalThis.sprite = s;
// 		}
// 	})
//
// })
// const canvascontainer = document.querySelector(".game")
// const canvas = document.querySelector("canvas")
// const app = createRenderer({ view: canvas, resizeTo: canvascontainer });
// setupDragging(app);


let panel = createPanel({
	id: "about",
	single: true,
	title: "Big Changes are coming",
	pinnable: false,
	dontopen: true,
	html: `
		<p>Say good bye to the placeholder "hello world"s and "how many apples do you have" as this is going to start having more useful things relating to creating games.</p>
		<h2>What you have you been doing all this time?</h2>
		<p>If the placeholder stuff wasn't evident, I have been creating tools todo with programatically creating editor functionality, so I can most effectivly build the engine and its editor simultaniously with the least effort, plus this editor as all about reducing as much effort as possible.
		<br>
		Stay tuned as things like; level management, object customisation, coder/non-Coder geneated content, exporting and play link sharing are all coming soon.
		<br>
		</p>
		<a style="display:block;text-align:center"  href="https://github.com/stb-gaming/stb-engine/blob/master/notes/TODO.md" target="_blank">Whats next?</a>
		`
})
createMenuButton("About", panel.open)

Object.assign(STB_EDITOR, {
	createFunction: fn,
	createPanel,
	createSystem,
	importGist,
	createForm,
	createMenuButton,
	createBinding,
	oneTimeEventListener,
	createHTML
})

globalThis.STB_EDITOR = STB_EDITOR;




// if(location.hostname==="localhost") {
// 	window.onbeforeunload = function(e) {
// 		console.log(e)
// 		e.preventDefault();
//     }
// }
