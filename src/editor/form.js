import { defined,fn } from './util.js';
import { htmlTag, createHTML } from './html.js';

const createOption = (value, label = value) => htmlTag("option", { value }, label)

//String - textbox
//Number - numberbox
//boolean - checkbox
//object - select

createHTML({
	id:"field-input",
	base:`<input></input>`,
	query:{input:"input"},
	cb:setupInput
})
createHTML({
	id:"field-select",
	base:`<select></select>`,
	query:{input:"select"},
	cb:setupInput
})
createHTML({
	id:"form",
	base:`<form action="#"></form>`,
	query:{form:"form"},
	cb:setupForm
})

function setupInput(fragment,{input},{
	options,
	example,
	placeholder = example,
	value,
	type = typeof value,
	name,
	id=[type,+Math.round(Math.random()*1000),name].filter(a=>!!a).join("-"),
	label=name,
	submit
}) {
	if (type === "object") value = JSON.stringify(value)
		if(submit) type = "submit"
	if(input.tagName==="INPUT") {
		input.type  = {
			"string": "text",
			"boolean": "checkbox",
		}[type] || type || "text";
	}
	if(placeholder) input.placeholder = placeholder
	if(name) input.name = name
	if(value) input.value = value
	if(input.tagName==="SELECT"&&options && typeof options === "object") {

	}
	if(label) {
		const container = document.createElement("div")
		const children = [createHTML(`<label for="${id}">${label}</label>`),input]
		if(type==="checkbox") {
			children.reverse()
		}
		container.append(...children)
		fragment.appendChild(container)
	}

	if(id) input.id = id
}

function setupForm(fragment,{form},schema) {
	if (!schema || typeof schema !== "object") return;
	form.schema = schema;
	if(schema.submit){
		if(!schema.submit.submit) {
			schema.submit= {submit:fn(schema.submit)}
		}
		schema.submit.type = "submit"
		schema.submit.value ??= scheme.submit.label??"Submit"
		schema.submit.label = false
		//schema.submit.label ??=""
	}
	for(let [key,value] of Object.entries(schema)) {
		value = (typeof value === "object"&&["value","type"].some(r=> Object.keys(value).includes(r)))?value:{value};
		value.name ??= key
		const base = typeof value.value === "object" ?"field-select":"field-input";
		console.log({base,value})
		form.appendChild(createHTML({base,args:value}))
	}
	if(!schema.submit.label) form.setAttribute("onsubmit","return false")
	form.addEventListener("submit", e => {
		e.preventDefault()
		schema.submit.submit(getFormData(form, schema))
		return false
	});
	//form.appendChild(createHTML({base:"field-input",args:{type:"submit",value:"Submit"}}))
		form.method = schema.submit?.panel?"dialog":"none"

}


export function getFormData(form, schema = form.schema) {
	if (!(form instanceof HTMLFormElement)) return;
	const formData = new FormData(form);
	const entries = Array.from(formData.keys(),key => {
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

export const createForm = (schema={}, onSubmit) => {
	if(onSubmit) {
		console.warn("This param is deprecated now")
	}
	return createHTML({base:"form",args:schema})
}
