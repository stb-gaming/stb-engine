import { htmlTag, createHTML, spawnElement, despawnElement, makeElementDragable, setElementPosition } from './html.js';
import { defined, oneTimeEventListener, removeableEventListener, fn, whenever } from './util.js';
import { createForm, getFormData } from './form';


const panels = {};
globalThis.panels = panels;

createHTML({
	id: "panel",
	base: `<dialog class="panel">
	<div class="panel-head">
		<h3 class="panel-title"></h3>
		<span class="panel-actions">
			<button class="panel-pin">📌</button>
			<button class="panel-close">❌</button>
		</span>
	</div>
	<div class="panel-body"></div>
</dialog>`,
	cb: setupPanel,
	query: {
		panel: ".panel",
		title: ".panel-title",
		close: ".panel-close",
		pin: ".panel-pin",
		body: ".panel-body"
	}
})



function setupPanel(fragment, query, panel = {}) {
	const out = {};
	console.debug("Setup Panel", { fragment, query, panel })
	query.title.innerText = panel.title ?? query.title.innerText

	if (Object.hasOwn(panel, "pinnable") && !panel.pinnable) {
		query.pin.remove();
	}
	if (Object.hasOwn(panel, "closeable") && !panel.closeable) {
		query.close.remove();
	} else {
		query.close.addEventListener("click", () => {
			whenever(panel.close || query.panel.close.bind(query.panel));
		})
	}
	if (Object.hasOwn(panel, "body")) {
		console.warn("panel.body will be changed to panel.fn")
		panel.fn = panel.body
	}


	if (Object.hasOwn(panel, "text")) {
		query.body.innerText = Array.isArray(panel.text) ? panel.text.join("\n") : panel.text;
	} else
		if (Object.hasOwn(panel, "html")) {
			const parsedElements = Array.isArray(panel.html) ? Array.from(panel.html, createHTML) : createHTML(panel.html)
			parsedElements instanceof HTMLCollection.prototype ? query.body.append(...parsedElements) : query.body.appendChild(parsedElements)
		} else if (Object.hasOwn(panel, "form")) {
			if (panel.form.submit) {
				if (!panel.form.submit.submit) {
					panel.form.submit = {
						submit: fn(panel.form.submit)
					}
				}
				panel.form.submit.panel = true;
			}
			const form = createForm(panel.form)
			query.body.appendChild(form)

			query.form = form;
		} else if (Object.hasOwn(panel, "fn")) {
			fn(panel.body)(query.body)
		}
	if (Object.hasOwn(panel, "onclose")) {
		panel.onclose = fn(panel.onclose)
		query.panel.addEventListener("close", () => {
			panel.onclose(getFormData(query.form, panel.form))
		})
	}


	if (!Object.hasOwn(panel, "moveable") || panel.moveable) makeElementDragable(query.panel, ".panel-head")
}

function dockPrompt(prompt, side) {
	const sidebar = document.querySelector("body>.sidebar." + side)
	sidebar.appendChild(prompt)

}

export function createPanel(panel) {
	if (!panel) return;
	// Registration
	if (Object.hasOwn(panels, panel)) {
		panel = panels[panel];
		if (!panel.single) {
			panel = {
				base: panel.id
			}
		}
	} else if (Object.hasOwn(panel, "id") && !Object.hasOwn(panels, panel.id)) {
		panels[panel.id] = panel;
		console.debug("Registered new Panel")
	}
	if (typeof panel !== "object") return
	panel.prompt ??= !!panel.form;
	panel.single ??= !panel.id || panel.prompt;

	// Construction
	panel.element ??= createHTML({ id: panel.id ? "panel-" + panel.id : null, base: panel.base ? "panel-" + panel.base : "panel", args: panel })
	if (Object.hasOwn(panel, "element")) {
		if (panel.prompt) panel.element.dataset.prompt = true;
		panel.open ??= () => {
			panel.element["show" + (panel.prompt ? "Modal" : "")].call(panel.element)
			const { width, height } = panel.element.getBoundingClientRect()
			setElementPosition(panel.element, [window.innerWidth / 2 - width / 2, window.innerHeight / 2 - height / 2])
			if (typeof panel.onopen === "function") {
				setTimeout(panel.onopen, 0)
			}
		}
		console.log(panel)
		panel.close = () => {
			panel.element.close()
		}
	}

	// Spawn
	if (panel.single && panel.element) spawnElement(panel.element)
	if (panel.open && !panel.dontopen) {
		panel.open()
	}


	return panel;
}


document.addEventListener("keydown", e => {
	console.debug(e)
	if (e.key === "Escape") {
		let closeBtns = document.querySelectorAll("[open] .panel-close")
		if (closeBtns.length) closeBtns[closeBtns.length - 1].click()
	}
})
