import { htmlTag, createHTML, spawnElement, despawnElement, makeElementDragable } from './html.js';
import { defined, oneTimeEventListener, removeableEventListener } from './util.js';
import { createForm, getFormData } from './form';

export function getPromptBody(prompt) {
	return prompt.querySelector(".prompt-body")
}

export const openPrompt = spawnElement;
export const closePrompt = despawnElement;

function dockPrompt(prompt, side) {
	const sidebar = document.querySelector("body>.sidebar." + side)
	sidebar.appendChild(prompt)

}

export function createPrompt(title, options = {}) {
	const prompt = createHTML(htmlTag("div", { class: "prompt" },
		htmlTag("span", { class: "prompt-head" },
			htmlTag("span", {}, title) +
			(options.nopin ? "" : htmlTag("button", { class: "pin-prompt" }, "📌")) +
			(options.noclose ? "" : htmlTag("button", { class: "close-prompt" }, "❌"))
		) + htmlTag("span", { class: "prompt-body" })
	));
	const closeBtn = prompt.querySelector(".close-prompt");
	if (closeBtn)
		oneTimeEventListener(closeBtn, "click", () => {
			closePrompt(prompt)
			if (options.onClose) options.onClose()
		})

	let dockSideForm;
	const pinBtn = prompt.querySelector(".pin-prompt");
	if (pinBtn)
		pinBtn.addEventListener("click", () => {
			if (dockSideForm) return
			dockSideForm = quickFormPrompt("Docking prompt", {
				side: { label: "Which side?", options: ["left", "right"] },
				"": { type: "submit" }
			}, {
				onSubmit: data => {
					dockSideForm = null;
					dockPrompt(prompt, data.side)
				},
				nopin: true
			})
		})

	if (options.dock) {
		dockPrompt(prompt, options.dock)
	}

	makeElementDragable(prompt, ".prompt-head")

	return prompt
}


export function quickTextPrompt(title, text, options = {}, parent) {
	const prompt = createPrompt(title, options)
	const promptBody = getPromptBody(prompt);
	promptBody.appendChild(
		createHTML(`
			<p>${text}</p>
		`)
	)
	openPrompt(prompt, options.parent)
	return prompt;
}

export function quickFormPrompt(title, schema, options = {}) {
	const prompt = createPrompt(title, options)
	const promptBody = getPromptBody(prompt);
	const form = createForm(schema, (...a) => {
		if (options.onSubmit) options.onSubmit(...a)
		closePrompt(prompt)
	})
	promptBody.appendChild(form)
	openPrompt(prompt, options.parent)
	return prompt;
}
