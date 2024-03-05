export function createHTML(html) {
	const fragment = document.createDocumentFragment();
	const span = document.createElement("span")
	fragment.appendChild(span)
	span.innerHTML = html;
	
	return span.firstElementChild
}
