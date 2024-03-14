import {createHTML} from './html.js';

const menubar = document.querySelector(".menubar")

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
	let buttom = createHTML({base:"menu-button",args:{label,onclick}})
	menubar.appendChild(buttom)
}
