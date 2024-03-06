import {onEvent,emitEvent} from "./events.js"
let looping = false;
let last,lastFixed,targetDeltaFixed=1/60


export function sleep(ms) {
	return new Promise(cb=>setTimeout(cb,ms))
}

function tick(ms) {
	const now = ms/1000;
	let delta = now-last;
	let deltaFixed = now - lastFixed||last

	emitEvent("frameBegin")	
	emitEvent("update",delta)

    if (deltaFixed >= targetDeltaFixed) {
        emitEvent("fixedUpdate", targetDeltaFixed, now-lastFixed)
        lastFixed = now;
    }	

    emitEvent("lateUpdate",delta)

	last = now;
	emitEvent("frameEnd")
	if(delta>1) return
	sleep(Math.random()*10)
	requestAnimationFrame(tick);
}

onEvent("createEvent",name=>{
	if(!looping&&["frameBegin","fixedUpdate","update","lateUpdate","frameEnd"].includes(name)) {
		looping = true;
		requestAnimationFrame(tick)
		console.debug("Started Gameloop")
		emitEvent("start")

		
	}
})
onEvent("fixedUpdate",(delta,realDelta)=>{
	console.log({delta,fps:1/delta,realDelta})
})
