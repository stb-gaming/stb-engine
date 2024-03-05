import {getLoadedGists} from "./gists"
import format from "html-format";
import {createHTML} from './html.js';


function getPixi() {
	const url = "https://pixijs.download/release/pixi.js"
	const js = document.createElement("script")
	js.src= url
	return js
}
function getEngine() {
	const url = location.href + "assets/scripts/engine.js"
	const js = document.createElement("script")
	js.src= url
	return js
}


function getCreation() {
	// TODO USERS CREATIONS CONVERTED TO JS OR JSON
	return createHTML(`<script>
	createSprite("ball.png")
	</script>
	`);
}


export function getHTML() {
	const doc = document.implementation.createHTMLDocument();
	const gists = getLoadedGists();

	doc.body.append(getPixi(),getEngine(),...gists.map(g=>g.element),getCreation())

	return    format(doc.firstElementChild.outerHTML.replaceAll("><",">\n\r<")," ".repeat(4));
}



globalThis.Export = {getHTML}
