import { defined } from './util.js';
import { htmlTag, createHTML } from './html.js';

const createOption = (value, label = value) => htmlTag("option", { value }, label)

createHTML({id:"form",base:`<form action="#" onsubmit="return false;"></form>`,cb:setupForm,query:{form:"form"}})

function setupForm(fragment,{form},schema) {

	for(const key in scheme) {
		form.appendChild(createField(key,schema[key]))
	}

}


export function createField(name, {
	options,
	example,
	placeholder = example,
	value,
	type = defined(value) && typeof value,
	id = name,
	label,
} = {}) {
	if (type === "object") value = JSON.stringify(value)
	type = {
		"string": "text",
		"boolean": "checkbox",
	}[type] || type || "text";
	let input = "";

	if (options && typeof options === "object") {
		const optionsStr = Array.isArray(options)
			? options.map(value => createOption(value)).join("")
			: Object.entries.map(([key, label]) => createOption(key, label)).join("")

		input = createHtml(htmlTag("select", { id, name, value, placeholder }, optionsStr))
	} else {
		input = htmlTag("input", { id, name, type, placeholder, value })
	}
	if (label) {
		return htmlTag("div", {}, htmlTag("label", { for: id }, label) + input)
	} else {
		return input
	}
}

export function createForm(schema, onSubmit = () => { }) {
	if (!schema || typeof schema !== "object") return;
	const fieldString = Object.entries(schema).map(([key, options]) =>
		createField(key, typeof options === "object" ? options : { value: options })
	).join("")
	const formStr = htmlTag("form", { onsubmit: "return false;" }, fieldString);

	const form = createHTML(formStr);
	form.schema = schema;
	form.action = "#"
	form.addEventListener("submit", () => {
		onSubmit(getFormData(form, schema))
		return false;
	});
	return form;
}

export function getFormData(form, schema = form.schema) {
	if (!(form instanceof HTMLFormElement)) return;
	const formData = new FormData(form);
	const entries = Array.from(Object.keys(schema), key => {
		if (!schema || !Object.hasOwn(schema,key)) return [];
		const value = formData.get(key);
		let options = schema[key];
		options = typeof options === "object" ? options : { value: options }
		let type = options.type || typeof options.value || "text"
		if (["button", "reset", "submit"].includes(type)) {
			return []
		}

		const parsedValue = {
			number: Number,
			object: JSON.parse,
			function: (new Function),
			boolean: Boolean
		}[type]?.call(null, value);

		return [key, defined(parsedValue) ? parsedValue : value];
	});
	const data = Object.fromEntries(entries)
	return data;
}
