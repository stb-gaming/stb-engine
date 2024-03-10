import { htmlTag, createHTML, spawnElement, despawnElement, makeElementDragable } from './html.js';
import { defined, oneTimeEventListener, removeableEventListener, fn } from './util.js';
import { createForm, getFormData } from './form';


const basePanel = createHTML(`
<dialogue class="panel">

</dialogue
`)


/*
 * Stages of Panels:
 *
 * * Registration x1
 * * Construction
 * * Spawning
 */

function createPanel(panel) {
	if (panel && typeof panel === "object" && !Array.isArray(panel)) {
		const out = {};
		if (!Object.hasOwn(pane, "title")) return;
		let titleBarContent = htmlTag("span", {}, panel.title);
		if (!Object.hasOwn(panel, "pinnable") || panel.pinnable) {
			titleBarContent += htmlTag("button", { class: "pin-prompt" }, "📌")
		}
		if (!Object.hasOwn(panel, "closeable") || panel.closeable) {
			titleBarContent += htmlTag("button", { class: "close-prompt" }, "❌")
		}
		const panelTitlebar = htmlTag("span", { class: "prompt-head" }, titleBarContent);
		const panelBody = htmlTag("span", { class: "prompt-body" })

		out.element = createHTML(htmlTag("div", { class: "prompt" }, panelTitlebar + panelBody));
		out.body = out.element.querySelector(".prompt-body")


		makeElementDragable(out.element, "")

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
