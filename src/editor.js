import {importGist,getLoadedGists} from "./editor/gists";
import * as Export from "./editor/export";
import {createPrompt} from "./editor/prompt";
const ASSETS = "assets/";
const IMG = `${ASSETS}img/`

const canvasConatainerer = document.querySelector("#canvas-container")
const canvas = document.querySelector("canvas")

loadCanvas(canvas,canvasConatainerer)
createSprite(`${IMG}ball.png`)


async function test() {
	const gist = await importGist("https://gist.githubusercontent.com/tumble1999/39eccd41a251e17f3454edcde0ce09d3/raw/6468653aa0e30a7aa62ee418d64632bda9893f6a/test.js")
	console.log(getLoadedGists()[gist])
}

test()

globalThis.exportBtn = function() {
	createPrompt({title:"Export",text:"Under construction\nThe code below might work, I don't even think this will be the main export type.\n\n"+Export.getHTML()})
}
