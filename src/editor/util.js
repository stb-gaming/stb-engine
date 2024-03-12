globalThis.Object.prototype.hasOwn

export const defined = v => ![null, undefined].includes(v)



export function removeableEventListener(element, type, cb) {
	element.addEventListener(type, cb);
	return () => element.removeEventListener(type, cb)
}

export function oneTimeEventListener(element, type, cb) {
	const remove = removeableEventListener(element, type, e => {
		remove()
		cb(e)
	})
}
export const arr = arr=>arr.length===1?arr[0]:arr

/**
 * @param {String} fn unction string
 * @param {String[]} fn Function(...) params
 * @param {Function} pass through
 * @returns {Function} parsed function
 */
export const fn = fn => typeof fn === "function" ? fn
	: Array.isArray(fn) ? new Function(...fn)
		: new Function(fn);
