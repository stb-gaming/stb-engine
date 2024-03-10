import { htmlTag, createHTML, spawnElement, despawnElement, makeElementDragable } from './html.js';
import { defined, oneTimeEventListener, removeableEventListener, fn } from './util.js';
import { createForm, getFormData } from './form';


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
	if (query && typeof query === "object") {
		const out = {};

		console.debug(query)
		if (!Object.hasOwn(panel, "title")) return;
			query.title.innerText = panel.title

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
	return panel;
}



export function panel(panel) {
	// Registration
	if (Object.hasOwn(panels, panel)) {
		panel = panels[panel];
	} else if (Object.hasOwn(panel, "id") && !Object.hasOwn(panels, panel.id)) {
		panels[id] = panel;
	}

	// Construction

	// Spawn
}
