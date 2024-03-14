import {createMenuButton} from './menubar.js';
import {createPanel} from './panel.js';
import {createHTML} from './html.js';


const systems = {};

const systemsManager = createHTML(
	`<div id="engine-settings">
				<h1>Systems</h1>
				<h1 id="system-name"></h1>
			<nav id="system-list" class="scroll-list">
			</nav>
			<section id="system-body">
			</section>
			</div>
			`);
createHTML({
			id:"system-null",
			base:"<span class='system-none'>There is nothing here.</span>",
		})
const listElement = systemsManager.querySelector("#system-list")
const titleElement = systemsManager.querySelector("#system-name")
const bodyElement = systemsManager.querySelector("#system-body")


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
		bodyElement.appendChild(createHTML(system.settings||"system-null"))
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
	cb:(frag,el,{title="Sample System",summary="This is a placeholder",img="assets/img/ball.png",id})=>{
		el.img.src = img;
		el.title.innerText = title;
		el.summary.innerText = summary;
		el.tab.addEventListener("click",()=>{
			selectSystem(id)
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
		onopen:()=>{
			if(!bodyElement.dataset.current){
				selectSystem(listElement.firstElementChild.dataset.id)
			}
		}

	})

panel.element.dataset.max = "true";


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
}


createSystem({id:"create-system",title:"Add System",summary:"Create or import a game system",settings:{
	base:`<p>
	This area, is still being made, check <a href="https://github.com/stb-gaming/stb-engine/wiki/Systems" >here</a> for more info.
	</p>`
}})

