import { defined, fn } from './util.js';
import { createHTML } from './html.js';

//String - textbox
//Number - numberbox
//boolean - checkbox
//object - select

createHTML({
	id: "field-option",
	base: `<option></option>`,
	query: { input: "option" },
	cb: (_, { input }, attribs = {}) => {
		if (typeof attribs !== "object") {
			attribs = { value: attribs }
		}

		input.innerText = attribs.label || attribs.value;
		delete attribs.label;
		for (const key in attribs) {
			input.setAttribute(key, attribs[key])
		}
	}
})
createHTML({
	id: "field-input",
	base: `<input></input>`,
	query: { input: "input" },
	cb: setupInput
})
createHTML({
	id: "field-select",
	base: `<select></select>`,
	query: { input: "select" },
	cb: setupInput
})
createHTML({
	id: "form",
	base: `<form action="#"></form>`,
	query: { form: "form" },
	cb: setupForm
})

function setupInput(fragment, { input }, {
	options,
	example,
	placeholder = example,
	value,
	type = typeof value,
	name,
	events,
	id = [type, +Math.round(Math.random() * 1000), name].filter(a => !!a).join("-"),
	label,
	submit,
	...attribs
}) {
	let container;
	if (id) input.id = id
	if (type === "object") value = JSON.stringify(value)
	if (input.tagName === "INPUT") {
		input.type = {
			"string": "text",
			"boolean": "checkbox",
		}[type] || type;
	}

	if (submit) type = "submit";

	if (placeholder) input.placeholder = placeholder
	if (name) input.name = name
	if (value) input.value = value
	if (options && typeof options === "object") {
		const optionElements = options.map(o => createHTML({ base: "field-option", args: o }));
		if (input.tagName === "SELECT") {
			input.append(...optionElements)
		} else {
			if (type === "datalist") {
				const datalist = createHTML("<datalist></datalist>")
				datalist.id = input.id + "-datalist";
				datalist.append(...optionElements)
				input.setAttribute("list", datalist.id)
				container ??= document.createElement("div")
				container.appendChild(input)
				container.appendChild(datalist)
				fragment.appendChild(container)
			}
		}

	}
	if (events) {
		for (const key in events) {
			input.addEventListener(key, events[key])
		}
	}
	for (const key in attribs) {
		input.setAttribute(key, attribs[key])
	}
	if (label) {
		container ??= document.createElement("div")
		const labelElement = createHTML(`<label for="${id}">${label}</label>`);
		const action = type === "checkbox" ? "appendChild" : "prepend";
		container[action](input);
		container[action](labelElement)
		fragment.appendChild(container)
	}

}

function setupForm(_, { form }, schema) {
	if (!schema || typeof schema !== "object") return;
	form.schema = schema;
	if (schema.submit) {
		if (!schema.submit.submit) {
			schema.submit = { submit: fn(schema.submit) }
		}
		schema.submit.type ??= "submit"
		schema.submit.value ??= schema.submit.label ?? "Submit"
		schema.submit.label = false
		//schema.submit.label ??=""
	}
	for (let [key, value] of Object.entries(schema)) {
		value = (value && typeof value === "object" && ["value", "type", "options"].some(r => Object.keys(value).includes(r))) ? value : { value };
		value.name ??= key
		const base = (!value.type || value.type == "select") && (typeof value.value === "object" || typeof value.options === "object") ? "field-select" : "field-input";
		console.log({ base, value })
		form.appendChild(createHTML({ base, args: value }))
	}
	if (schema.submit && !schema.submit.label) form.setAttribute("onsubmit", "return false")
	form.addEventListener("submit", e => {
		e.preventDefault()
		schema.submit.submit(getFormData(form, schema))
		return false
	});
	//form.appendChild(createHTML({base:"field-input",args:{type:"submit",value:"Submit"}}))
	form.method = schema.submit?.panel ? "dialog" : "none"
	if (form.method === "dialog") {
		form.removeAttribute("onsubmit")
	}

}


export function getFormData(form, schema = form.schema) {
	if (!(form instanceof HTMLFormElement)) return;
	const formData = new FormData(form);
	const entries = Array.from(formData.keys(), key => {
		if (!schema || !Object.hasOwn(schema, key)) return [];
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

export const createForm = (schema = {}, onSubmit) => {
	if (onSubmit) {
		console.warn("This param is deprecated now")
	}
	return createHTML({ base: "form", args: schema })
}
