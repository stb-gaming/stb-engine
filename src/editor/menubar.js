import {createHTML} from './html.js';
import {createBinding} from './help.js';
import {whenever} from './util.js';

const menubar = document.querySelector("menu")

createHTML({
	id:"menu-button",
	base:`<button></button>`,
	query:{button:"button"},
	cb:(fragment,{button},{label,onclick}={}) =>{
		button.innerText = label;
		button.addEventListener("click",onclick)
	}
})

export function createMenuButton(label,onclick=()=>alert("Not Implemented Yet")) {
	whenever(()=>{
	const button = createHTML({base:"menu-button",args:{label,onclick}})
		menubar.appendChild(button)
		createBinding(label,"Ctrl+"+menubar.children.length)
	})
}


document.addEventListener("keydown",e =>{
	if(e.ctrlKey) {
		const n = parseInt(e.key)
		if(n && !document.querySelector("[open][data-prompt]") ){

			menubar.children[n-1].click()
		}
	}
})
