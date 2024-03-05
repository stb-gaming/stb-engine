
import {createHTML} from './html.js'

export function createPrompt(options) {
	const p  = `
		<div id="prompt">
		<h1 id="prompt-title"></h1>
		<p id="prompt-text"></p>
		</div>
	`;
	const prompt = document.querySelector("#prompt")||createHTML(p)
	console.log(prompt)
	for(const key in options) {
		let el = prompt.querySelector("#prompt-"+key);
		if(typeof options[key]==="string") {
			el.innerText = options[key]
		}
	}

	prompt.addEventListener("click",()=>{
		prompt.remove();
	})


	document.body.appendChild(prompt)
}
globalThis.createPrompt = createPrompt
