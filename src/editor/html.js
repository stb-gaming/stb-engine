import { defined, oneTimeEventListener, removeableEventListener } from './util.js';


export const getEl = (parent, query) => (query ? parent : document).querySelector(query || parent);

const templates = {}


export function createHTML(id, pbase, pargs, pcb, pquery) {
	if(typeof id !== "string") throw new Error("ID must be a string")

	// Obtain Base Template
	const idStrings = [id,pbase].filter(base=>typeof base === "string")
	const base = idStrings.find((base,i)=>(Object.hasOwn(templates,base)||i+1==idStrings.length))
	//console.debug("base",base)
	const baseTemplate = templates[base];
	//console.debug("baseTemplate",baseTemplate);
	// Create Derivied
	let fragment;
	if(baseTemplate && typeof baseTemplate === "object" && baseTemplate.fragment instanceof DocumentFragment ) {
		fragment = baseTemplate.fragment.cloneNode(true);
		console.debug(`Created Derivation of ${base}`,baseTemplate.fragment,fragment)

		/// TODO: CALL baseTemplate.cb()
		if(typeof baseTemplate.cb === "function") {
			const query = {};
			if(baseTemplate.query && typeof baseTemplate.query === "object") {
				for (const k in baseTemplate.query) {
					if(!Object.hasOwn(templates[id]))query[k] = fragment.querySelector(baseTemplate.query[k])
				}
			}
			baseTemplate.cb(fragment,query,args)
		}


	} else {
		// Create fagment from HTML string
		const template = document.createElement("template")
		template.innerHTML = base
		fragment = template.content;
		console.debug("Converted html string to a <template>",template);
		if(base==id) {
			console.debug("❌ Created a html fragment without the intention of using it")
		} else {
			console.debug("✅ Created a reusable html fragment")
		}
	}
	//console.debug("fragment",fragment)
	// store Derivied template
	const cb = [pbase,pargs,pcb].find(cb=>typeof cb==="function")
	//console.debug("cb",cb)
	if(id!== base) {
		//obtain queries
		const query = (cb
			?[pcb,pquery]
			:[pargs,pcb,pquery]
		).find(cb=>typeof cb==="object")
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
	const {firstChild,lastChild,children} = fragment;
	return firstChild===lastChild?firstChild:children;
}

export function htmlTag(tag = "div", attribs = {}, contents = "") {
	const attribStr = Object.entries(attribs).map(([k, v]) => (defined(v) ? `${k}='${v}'` : "")).join(" ").trim()
	return `<${tag} ${attribStr}>${contents}</${tag}>`
}

export const spawnElement = (element, parent = document.body) => parent.appendChild(element)
export const despawnElement = element => element.remove();

export function setElementPosition({ style }, [x, y]) {
	style.position = "absolute";
	style.left = x + "px";
	style.top = y + "px";
}


export function getElementPosition(element) {
	//const {left,top} = element.getBoundingClientRect()
	const { left, top } = getComputedStyle(element)

	return [parseFloat(left), parseFloat(top)]
}

function createDragFunction(startPoint, startMouse) {
	return newMouse => [
		startPoint[0] + newMouse[0] - startMouse[0],
		startPoint[1] + newMouse[1] - startMouse[1]
	];
}



export function makeElementDragable(element, handleQuery) {
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
		const getNewPos = createDragFunction(
			getElementPosition(element),
			[e.x, e.y]
		)

		const removeMove = removeableEventListener(document, "mousemove", e => {
			if (typeof getNewPos === "function") {
				const newPos = getNewPos([e.x, e.y]);
				setElementPosition(element, newPos);
			}
		})
		oneTimeEventListener(document, "mouseup", removeMove)
		oneTimeEventListener(document, "mouseleave", removeMove)
		oneTimeEventListener(document, "blurr", removeMove)
	})

}

