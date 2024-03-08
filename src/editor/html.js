import {defined,oneTimeEventListener,removeableEventListener} from './util.js';

export function toHTML(htmlText) {
  const template = document.createElement('template');
  template.innerHTML = htmlText.trim();
  const children =  template.content.children
  if(children.length===1) {
  	return template.content.firstChild;
  } else {
  	return children;
  }
}

export function htmlTag(tag="div",attribs={},contents="") {
const attribStr = Object.entries(attribs).map(([k,v])=>(defined(v)?`${k}='${v}'`:"")).join(" ").trim()
	return `<${tag} ${attribStr}>${contents}</${tag}>`
}

export const spawnElement = (element,parent=document.body) =>parent.appendChild(element)
export const despawnElement = element =>element.remove();

export function setElementPosition({style},[x,y]) {
	style.position = "absolute";
	style.left = x+"px";
	style.top = y+"px";
}


export function getElementPosition(element) {
	//const {left,top} = element.getBoundingClientRect()
	const {left,top} = getComputedStyle(element)

	return [parseFloat(left),parseFloat(top)]
}

function createDragFunction(startPoint, startMouse) {
  return  newMouse => [
    startPoint[0] + newMouse[0] - startMouse[0],
    startPoint[1] + newMouse[1] - startMouse[1]
  ];
}



export function makeElementDragable(element,handleQuery) {
	const handle = element.querySelector(handleQuery)

	removeableEventListener(handle,"mousedown",e=>{
		if(e.target.tagName === "BUTTON") return
		const parent = element.parentElement;
		if(parent!==document) {
			delete element.left;
			delete element.top;
		}
		despawnElement(element)
		spawnElement(element)
		const getNewPos = createDragFunction(
			getElementPosition(element),
			[e.x,e.y]
		)

		const removeMove = removeableEventListener(document,"mousemove",e=>{
			if(typeof getNewPos === "function") {
				const newPos = getNewPos([e.x,e.y]);
				setElementPosition(element,newPos);
			}
		})
		oneTimeEventListener(document,"mouseup",removeMove)
		oneTimeEventListener(document,"mouseleave",removeMove)
		oneTimeEventListener(document,"blurr",removeMove)
	})

}

