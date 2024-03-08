

export const defined = v =>![null,undefined].includes(v)



export function removeableEventListener(element,type,cb) {
	element.addEventListener(type,cb);
	return ()=>element.removeEventListener(type,cb)
}

export function oneTimeEventListener(element,type,cb) {
	const remove = removeableEventListener(element,type,e=>{
		remove()
		cb(e)
	})
}
