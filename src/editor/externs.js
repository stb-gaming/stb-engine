
export async function fetchText(url) {
	const response = await fetch(url)
	return await response.text()
}

export function evalJS(text,script= document.createElement("script")) {
	if(text instanceof Promise) {
		text.then(t=>script.text = t)
	}else {
		script.text = text;
	}
	if(!script.parentNode)document.body.appendChild(script);
	return script;
}
export function loadJS(url,script= document.createElement("script")) {
	if(url instanceof Promise) {
		url.then(t=>script.src = t)
	}else {
		script.src = url;
	}
	if(!script.parentNode)document.body.appendChild(script);
	return script;
}

