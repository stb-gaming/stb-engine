const events = {}


export function emitEvent(name, ...args) {
	if(!events.hasOwnProperty(name)) return;
	events[name].forEach(cb=>cb(...args))
}


function createEvent(name) {
    if (!name || typeof name !== "string") {
      console.error(`Invalid event name`,name);
      return;
    }
    if(events.hasOwnProperty(name)) return;
    console.debug(`Event created ${name}`)
    events[name] = [];
    emitEvent("createEvent",name)
    return events[name];
}

export function onEvent(name,cb) {
	if(!createEvent(name))return
	events[name].push(cb)
	console.debug(`Added event listener for event '${name}'`,cb)
}

export function waitForEvent(name) {
	return new Promise(cb=>onEvent(name,cb))
}
