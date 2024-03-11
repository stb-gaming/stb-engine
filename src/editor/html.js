import { defined, oneTimeEventListener, removeableEventListener } from './util.js';


export const getEl = (parent, query) => (query ? parent : document).querySelector(query || parent);

const templates = {}


export function createHTML(id, pbase, pargs, pcb, pquery) {
	if(typeof id !== "string") throw new Error("ID must be a string")

	// Obtain Base Template
	const base = Object.hasOwn(templates,id)?id:pbase??id;
	const baseTemplate = templates[base];
	// Create Derivied
	let fragment;
	if(baseTemplate && typeof baseTemplate === "object" && baseTemplate.fragment instanceof DocumentFragment ) {
		fragment = baseTemplate.fragment.cloneNode(true);
		console.debug(`Created Derivation of ${base}`,baseTemplate.fragment,fragment)

		if(typeof baseTemplate.cb === "function") {
			const query = {};
			if(baseTemplate.query && typeof baseTemplate.query === "object") {
				for (const k in baseTemplate.query) {
					if(!Object.hasOwn(templates[id]))
						query[k] = fragment.querySelector(baseTemplate.query[k])
				}
			}
			const args = [pbase,pargs].find(args=>typeof args==="object")
			baseTemplate.cb(fragment,query,args)
		}
	} else {
		// Create fagment from HTML string
		const template = document.createElement("template")
		template.innerHTML = base?.trim();
		fragment = template.content;
		console.debug("Converted html string to a <template>",template);
		console.debug(
			base === id
				? "❌ Created an HTML fragment without the intention of reusing it"
				: "✅ Created a reusable HTML fragment"
		);
	}
	//console.debug("fragment",fragment)
	// store Derivied template
	const cb = [pargs,pcb].find(cb=>typeof cb==="function")
	//console.debug("cb",cb)
	if(id!== base) {
		//obtain queries
		const query = (cb?[pcb,pquery]:[pargs,pcb,pquery]).find(cb=>typeof cb==="object")
		//console.debug("query",query)
		//Store template
		templates[id] = {
			fragment,
			cb,
			query
		}

		fragment = templates[id].fragment.cloneNode(true);
		console.debug(`Registered new HTML Fragment '${id}':`,templates[id])
	} else if(cb) {
		console.warn("An id is required for a clone callback to be useful")
	}

	//console.debug("Returning constructed fragment",fragment)
	const {firstElementChild,lastElementChild,children} = fragment;
	return firstElementChild === lastElementChild ? firstElementChild : children;
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

