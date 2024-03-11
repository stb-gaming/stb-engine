import { htmlTag, createHTML, spawnElement, despawnElement, makeElementDragable,setElementPosition } from './html.js';
import { defined, oneTimeEventListener, removeableEventListener, fn } from './util.js';
import { createForm, getFormData } from './form';


const panels = {};

createHTML("panel",`
<dialog class="panel">
	<span class="panel-head">
		<span class="panel-title"></span>
		<button class="panel-pin">📌</button>
		<button class="panel-close">❌</button>
	</span>
	<span class="panel-body"></span>
</dialog>
`,setupPanel,{
	panel:".panel",
	title:".panel-title",
	close:".panel-close",
	pin:".panel-pin",
	body:".panel-body"
})



function setupPanel(fragment,query,panel={}) {
	const out = {};
	console.debug("Setup Panel",{fragment,query,panel})
	if (!Object.hasOwn(panel, "title")) return;
		query.title.innerText = panel.title ?? query.title.innerText

	if (Object.hasOwn(panel, "pinnable") && !panel.pinnable) {
		query.pin.remove();
	}
	if (Object.hasOwn(panel, "closeable") && !panel.closeable) {
		query.close.remove();
	} else {
		query.close.addEventListener("click",()=>{
			query.panel.close();
		})
	}


	makeElementDragable(query.panel, ".panel-head")
}



export function createPanel(panel) {
	let premade = Object.hasOwn(panels, panel);
	// Registration
	if (premade) {
		panel = panels[panel];
		if(!panel.single) {
			premade = false;
			panel = {
				base:panel.id
			}
		}
	} else if (Object.hasOwn(panel, "id") && !Object.hasOwn(panels, panel.id)) {
		panels[panel.id] = panel;
		console.debug("Registered new Panel")
	}
	if(typeof panel !== "object") return
	console.debug(panel)
	panel.single ??=!panel.id;
	const toConstruct = panel.single ^ premade;
	console.log({premade,toConstruct})

	// Construction
	if(toConstruct) {
		panel.element ??= createHTML(panel.id?"panel-"+panel.id:"panel",panel.base?"panel-"+panel.base:"panel",panel)
	}
	if(Object.hasOwn(panel,"element")) {
		panel.open ??= panel.element.show.bind(panel.element)
		panel.close ??= panel.element.close.bind(panel.element)
	}

	// Spawn
	if(!Object.hasOwn(panel.element||{parentElement:true}, "parentElement")) spawnElement(panel.element)
	if(toConstruct && panel.open) {
		panel.open();
		const {width,height} = panel.element.getBoundingClientRect()
		setElementPosition(panel.element,[window.innerWidth/2-width/2,window.innerHeight/2-height/2])
	}

	return panel;
}

createPanel({
	id:"fear",
    title:"Fear me"
})

globalThis.createPanel = createPanel
