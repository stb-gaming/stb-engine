import { STB_EDITOR } from "./STB_EDITOR";
import { createMenuButton } from "./menubar";
import { createPanel } from "./panel";


Object.prototype.toString = function() {
	return JSON.stringify(this);
}


export function getStorage() {
	if (Object.keys(localStorage).length > 0 || confirm("Can we access local storage for persistent storage of settings and stuff?")) {
		return localStorage;
	}
	return sessionStorage;
}

export function storageHas(k) {
	if (Object.keys(localStorage).length > 0) {
		return !!localStorage.getItem(k)
	}
	return false;
}

export const storage = new Proxy({}, {
	get(target, prop) {
		console.debug(`STORAGE[${prop}] 📤 `, target[prop])
		return target[prop] || JSON.parse(getStorage().getItem(prop))
	},
	set(target, prop, value) {
		console.debug(`STORAGE[${prop}] 📤 `, value)
		target[prop] = value
		getStorage().setItem(prop, JSON.stringify(value))
		return true;
	},
	deleteProperty(target, prop) {
		console.debug(`STORAGE[${prop}] ❌`, target[prop])
		delete target[prop];
		getStorage().removeItem(prop);
		return true;
	}
});

STB_EDITOR.storage = storage




createMenuButton("💾 Save", () => {
	STB_EDITOR.storage.game = JSON.stringify({
		imports: STB_EDITOR.game.imports,
		time: STB_EDITOR.game.time,
		input: { binds: STB_EDITOR.game.input.binds },
		scenes: STB_EDITOR.game.scenes
	})
})
