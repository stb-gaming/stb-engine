import {createMenuButton} from './menubar.js';
import {createPanel} from './panel.js';
import {createHTML} from './html.js';
import {STB_EDITOR} from './STB_EDITOR'


const systems = {};

const systemsManager = createHTML(
	`<div id="engine-settings">
			<div id="system-list" class="scroll-list">
			</div>
			</div>
			`);
createHTML({

			id:"system-null",
			base:"<span class='system-none'>There is nothing here.</span>",
		})
const listElement = systemsManager.querySelector("#system-list")


function selectSystem(id) {
	const lastId = bodyElement.dataset.current
	if(lastId) {
		const lastSystem = systems[lastId]
		lastSystem.tab.classList.toggle("active",false)
		bodyElement.innerHTML = ""

	}
	const system=systems[id];
	if(system) {
		system.tab.classList.toggle("active",false)
		bodyElement.dataset.current = id;
		titleElement.innerText = system.title;
		const systemBody = createHTML(system.settings||"system-null");
		bodyElement.append(...systemBody.length?systemBody:[systemBody])
		console.debug(`Set system to ${id}`)
	}else {
		console.error(`There is no system called ${id}`)
	}
}

createHTML({
	id:"system-tab",
	base:`<button>
			<img src="assets/img/ball.png"/>
			<strong class="title">Hello World</strong>
			<small class="summary">Example System</small>
		</button>`,
	query:{
		tab:'button',
		img:"img",
		title:'.title',
		summary:'.summary'
	},
	cb:(frag,el,{title="Sample System",summary="This is a placeholder",img="assets/img/ball.png",id,panel})=>{
		console.warn("HELLO",panel)
		el.img.src = img;
		el.title.innerText = title;
		el.summary.innerText = summary;
		el.tab.addEventListener("click",()=>{
			//selectSystem(id)
			createPanel(panel)
		})
	}
})


const panel = createPanel({
		id:"settings",
		title: "Engine Systems",
		single: true,
		pinnable: false,
		dontopen:true,
		body:body=>{
			body.appendChild(systemsManager)
		},
		// onopen:()=>{
		// 	if(!bodyElement.dataset.current && listElement.firstElementChild){
		// 		selectSystem(listElement.firstElementChild.dataset.id)
		// 	}
		// }

	})


createMenuButton("Systems",panel.open)

export function createSystem(system) {
	let placeBefore = false||Object.hasOwn(systems,"create-system")
	if (Object.hasOwn(system, "id") && !Object.hasOwn(systems, system.id)) {
		systems[system.id] = system;
		console.debug("Registered new system",system)
	}
	system.tab = createHTML({base:"system-tab",args:system})
	system.tab.dataset.id = system.id;
	system.remove = ()=>{
		system.tab.remove();
	}
	listElement.appendChild(system.tab)
	STB_EDITOR.game[system.id] ??= system.default||{}
	return STB_EDITOR.game[system.id]
}


