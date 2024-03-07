import {defined} from './util.js';

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


export function getElementPosition({getBoundingClientRect}) {
	const{x,y} = getBoundingClientRect()
	return [x,y]
}


export function makeElementDragable(element,handleQuery) {
console.log("dragable",{element,handleQuery});
const handle = element.querySelector(handleQuery)
handle.addEventListener("mousedown",console.log)

}


