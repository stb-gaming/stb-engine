import { defined, oneTimeEventListener, removeableEventListener } from './util.js';


export const getEl = (parent, query) => (query ? parent : document).querySelector(query || parent);

const fragments = {}


function createFragment(html) {
	const template = document.createElement("template")
	template.innerHTML = html;
	return template.content
}

function resolveFragment(fragment) {
	const {firstChild,lastChild,children} = fragment;
	return firstChild===lastChild ? firstChild : children;
}


/*
id = string
base = string
args = object
if id not exist =>query = object
cb fubction
*/

// createHTML(null, base)
// createHTML(id)
// createHTML(id,base)


/**
 * id string
 * 			object, funtion bad
 * base     object,function => null
 * args function => null
 *
 *
 */

export function createHTML(id, base, args, cb, query) {
// params: id base args cb query
	// get fragments[id] =>  {...queryResults,fragment,cb}
	//if no fragments[id]  get fragments[base] =>  {...queryResults,fragment,cb}
	// if no fragments[base]
		// create a  fresh fragment
		// if query then make a new object where the values are replaced with fragment.querySelector(value)
		// cretae object {...queryResults,fragment,paramcb}
	// if fragments[base] did exist
		// clone fragment
		// call base.cb({...q,f},param args
	// if fragments[id] diddnt exist
		// create a queryparamas{} where you take param query {} and replace the values with fragmmnet.querySelector(value)
		// take params and form {fragment,cb,...queryparamas}

	// return fragment.children or firstChild

	if(typeof id !== "string") throw new Error("Invalid id type")

	if(typeof cb === "object") {
		query = cb;
		cb = null;
	}

	if(typeof args === typeof base === "function") throw new Error("Too many functions passed in")
	if(typeof args === "function") {
		cb = args;
		args = null;
	}
	if(typeof base === "string") {

	} else {
		if(typeof base === "function") {
			cb = base;
			query = args;
			args=null
		}
		if(typeof base === "object") args = base;
		base = null;
	}
	console.log({id, base, args, cb, query})
}














globalThis.createHTML = createHTML
globalThis.fragments = fragments

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

