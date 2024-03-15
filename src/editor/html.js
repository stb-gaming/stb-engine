import { defined, oneTimeEventListener, removeableEventListener,arr,fn } from './util.js';


export const getEl = (parent, query) => (query ? parent : document).querySelector(query || parent);

const templates = {}

/**
 * Creates HTML elements based on the provided input.
 * @param {string|Object} html - The HTML string or an object containing properties.
 * @param {string} [html.base] - The base HTML string to create elements from.
 * @param {string} [html.id] - Optional ID for storing the created template.
 * @param {Function} [html.cb] - Callback function to manipulate the created HTML elements.
 * @param {Object.<string, string>} [html.query] - Query selectors for selecting specific elements within the created HTML.
 * @param {Object.<string, any>} [html.args] - Additional arguments to be passed to the callback function.
 * @returns {Element[]|Element} An array of HTML elements created from the input.
 */
export function createHTML(html) {
	if(typeof html === "string") html={base:html}
	html.cb &&=fn(html.cb)

	const base = templates[html.base];
	// Create Derivied
	if(base?.fragment instanceof DocumentFragment ) {
		html.fragment = base.fragment.cloneNode(true);
		console.debug(`Created Derivation of ${html.base}`,base.fragment,html.fragment)

		if(typeof base.cb === "function") {
			for (const k in base.query||{}) {
				html.elements ??= {};
				html.elements[k] ??= html.fragment.querySelector(base.query[k])
			}
			base.cb(html.fragment,html.elements,html.args)
		}
	} else {
		// Create fagment from HTML string
		const template = document.createElement("template")
		template.innerHTML = html?.base?.trim();
		html.fragment = template.content;
		console.debug(
			defined(html.id)
				? "✅ Created a reusable HTML fragment"
				: "❌ Created an HTML fragment without the intention of reusing it",html
		);
	}
	// store Derivied template
	if(html.id) {
		//Store template
		templates[html.id] ??= html;
		console.debug(`Registered new HTML Fragment '${html.id}':`,templates[html.id])
	} else if(html.cb) {
		if(typeof html.cb === "function") {
			for (const k in html.query||{}) {
				html.elements ??= {};
				html.elements[k] ??= html.fragment.querySelector(html.query[k])
			}
			html.cb(html.fragment,html.elements,html.args)
		}
	}
	if(html.getfrag) return html.fragment;
	return arr(html.fragment.children)
}

globalThis.createHTML = createHTML

export function htmlTag(tag = "div", attribs = {}, contents = "") {
	const attribStr = Object.entries(attribs)
				.map(([k, v]) => (defined(v) ? `${k}='${v}'` : ""))
				.join(" ").trim()
	return `<${tag} ${attribStr}>${contents}</${tag}>`
}

export const spawnElement = (element, parent = document.body) => parent.appendChild(element)
export const despawnElement = element => element.remove();


export const setElementPosition = ({ style }, [x, y]) => {
	style.position = "absolute";
	style.left = x + "px";
	style.top = y + "px";
};

export const getElementPosition = element => {
	const { left, top } = getComputedStyle(element);
	return [parseFloat(left), parseFloat(top)];
};

const createDragFunction = (startPoint, startMouse) => (newMouse) => [
	startPoint[0] + newMouse[0] - startMouse[0],
	startPoint[1] + newMouse[1] - startMouse[1],
];



export const makeElementDragable = (element, handleQuery) => {
	const handle = element.querySelector(handleQuery)

	removeableEventListener(handle, "mousedown", e => {
		if (e.target.tagName === "BUTTON") return
		const parent = element.parentElement;
		if (parent !== document) {
			delete element.left;
			delete element.top;
		}
		despawnElement(element)
		spawnElement(element)

		const getNewPos = createDragFunction(getElementPosition(element), [e.x, e.y]);

		const removeMove = removeableEventListener(document, "mousemove", e => {
			if (typeof getNewPos === "function") {
				const newPos = getNewPos([e.x, e.y]);
				setElementPosition(element, newPos);
			}
		})
		oneTimeEventListener(document, "mouseup", removeMove)
		oneTimeEventListener(document, "mouseleave", removeMove)
		oneTimeEventListener(document, "blur", removeMove)
	})

}

