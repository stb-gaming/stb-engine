"use strict";
import { game } from './game.js'
if (Object.hasOwn(globalThis, "STB_EDITOR")) {
	STB_EDITOR.createSystem({
		// System ID
		id: "events",
		//System Icon
		// img:"https://avatars.githubusercontent.com/u/583231",
		/// System Name
		title: "Events",
		// System Description
		summary: "Manages game events",
	});
}

const events = game.events ??= {};

export function callEvent(name, ...args) {
	if (Object.hasOwn(events, name)) {
		events[name].forEach(listener => listener(...args))
	}
}

export const emitEvent = callEvent;

export function onEvent(name, cb) {
	if (!name || typeof name !== "string") {
		console.error(`Invalid event name`, name);
		return;
	}
	if (!Object.hasOwn(events, name)) {
		console.debug(`Event created ${name}`)
		callEvent("createEvent", name)
	}
	events[name] ??= [];
	const store = cb => {
		events[name].push(cb)
		console.debug(`Added event listener for event '${name}'`, cb)
	}
	return cb ? store(cb) : new Promise(store)
}
