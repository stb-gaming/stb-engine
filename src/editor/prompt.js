import {htmlTag,toHTML,spawnElement,despawnElement} from './html.js';
import {createForm,getFormData} from './form';

export function getPromptBody(prompt) {
	return prompt.querySelector(".prompt-body")
}

export const openPrompt = spawnElement;
export const closePrompt = despawnElement;

export function createPrompt(title,onClose=()=>{}) {
	const prompt = toHTML(htmlTag("div",{class:"prompt"},
		htmlTag("span",{class:"prompt-head"},
			htmlTag("h3",{},title)+
			htmlTag("button",{class:"close-prompt"},"❌")
		)+htmlTag("span",{class:"prompt-body"})
	));

	const closeBtn = prompt.querySelector(".close-prompt");
	closeBtn.addEventListener("click",()=>{
		closePrompt(prompt)
		onClose()
	})
	return prompt
}

export function quickTextPrompt(title,text,parent) {
	const prompt = createPrompt(title)
	const promptBody = getPromptBody(prompt);
	promptBody.appendChild(
		toHTML(`
			<p>${text}</p>
		`)
	)
	openPrompt(prompt,parent)
	return prompt;
}

export function quickFormPrompt(title,schema,onClose=()=>{},parent) {
	const prompt = createPrompt(title)
	const promptBody = getPromptBody(prompt);
	const form = createForm(schema,(...a)=>{
		onClose(...a)
		closePrompt(prompt)
	})
	promptBody.appendChild(form)
	openPrompt(prompt,parent)
	return prompt;	
}
