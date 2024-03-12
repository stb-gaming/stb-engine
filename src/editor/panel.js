import { htmlTag, createHTML, spawnElement, despawnElement, makeElementDragable,setElementPosition } from './html.js';
import { defined, oneTimeEventListener, removeableEventListener, fn } from './util.js';
import { createForm, getFormData } from './form';


const panels = {};
globalThis.panels = panels;

createHTML({
	id:"panel",
	base:`<dialog class="panel">
	<span class="panel-head">
		<span class="panel-title"></span>
		<button class="panel-pin">📌</button>
		<button class="panel-close">❌</button>
	</span>
	<span class="panel-body"></span>
</dialog>`,
	cb:setupPanel,
	query:{
		panel:".panel",
		title:".panel-title",
		close:".panel-close",
		pin:".panel-pin",
		body:".panel-body"
	}
})



function setupPanel(fragment,query,panel={}) {
	const out = {};
	console.debug("Setup Panel",{fragment,query,panel})
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
	if(Object.hasOwn(panel, "body")) {
		fn(panel.body)(query.body)
	}else if(Object.hasOwn(panel, "form")) {
		const form = createForm(panel.form,true)
		query.body.appendChild(form)

		query.form = form;
	}
	if(Object.hasOwn(panel, "onclose")) {
		panel.onclose = fn(panel.onclose)
		query.panel.addEventListener("close",()=>{
			panel.onclose(getFormData(query.form,panel.form))
		})
	}


	if (!Object.hasOwn(panel, "moveable") || panel.moveable) makeElementDragable(query.panel, ".panel-head")
}

function dockPrompt(prompt, side) {
	const sidebar = document.querySelector("body>.sidebar." + side)
	sidebar.appendChild(prompt)

}

export function createPanel(panel) {
	// Registration
	if (Object.hasOwn(panels, panel)) {
		panel = panels[panel];
		if(!panel.single) {
			panel = {
				base:panel.id
			}
		}
	} else if (Object.hasOwn(panel, "id") && !Object.hasOwn(panels, panel.id)) {
		panels[panel.id] = panel;
		console.debug("Registered new Panel")
	}
	if(typeof panel !== "object") return
	panel.prompt ??= !!panel.form;
	panel.single ??=!panel.id||panel.prompt;

	// Construction

		panel.element ??= createHTML({id:panel.id?"panel-"+panel.id:null,base:panel.base?"panel-"+panel.base:"panel",args:panel})
	if(Object.hasOwn(panel,"element")) {
		panel.open ??= panel.element["show"+(panel.prompt?"Modal":"")].bind(panel.element)
		panel.close ??= panel.element.close.bind(panel.element)
	}

	// Spawn
	if(panel.single&& panel.element) spawnElement(panel.element)
	if(panel.open) {
		panel.open();
		const {width,height} = panel.element.getBoundingClientRect()
		setElementPosition(panel.element,[window.innerWidth/2-width/2,window.innerHeight/2-height/2])
	}


	return panel;
}
