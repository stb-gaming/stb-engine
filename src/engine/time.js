import { onEvent, emitEvent } from "./events.js"
import { game } from './game.js'
let defaultFixedFPS = 60;
if (Object.hasOwn(globalThis, "STB_EDITOR")) {
	STB_EDITOR.createSystem({
		// System ID
		id: "time",
		//System Icon
		// img:"https://avatars.githubusercontent.com/u/583231",
		/// System Name
		default: null,
		title: "Time",
		// System Description
		summary: "Manages gameloop and timings",
		panel: {
			form: {
				fixedFPS: defaultFixedFPS,
				submit: {
					submit: function({ fixedFPS }) {
						game.title.targetDeltaFixed = 1 / fixedFPS;
					}
				}
			}
		}
	});
}

const time = game.time ??= {
	targetDeltaFixed: 1 / defaultFixedFPS,
};

let looping = false;
let last, lastFixed;


export function sleep(ms) {
	return new Promise(cb => setTimeout(cb, ms))
}

function tick(ms) {
	const now = ms / 1000;
	let delta = now - last;
	let deltaFixed = now - lastFixed || last

	emitEvent("frameBegin")
	emitEvent("update", delta)

	if (deltaFixed >= time.targetDeltaFixed) {
		emitEvent("fixedUpdate", time.targetDeltaFixed, now - lastFixed)
		lastFixed = now;
	}

	emitEvent("lateUpdate", delta)

	last = now;
	emitEvent("frameEnd")
	if (delta > 1) return
	sleep(Math.random() * 10)
	requestAnimationFrame(tick);
}

onEvent("createEvent", name => {
	if (!looping && ["frameBegin", "fixedUpdate", "update", "lateUpdate", "frameEnd"].includes(name)) {
		looping = true;
		requestAnimationFrame(tick)
		console.debug("Started Gameloop")
		emitEvent("start")


	}
})
onEvent("fixedUpdate", (delta, realDelta) => {
	console.log({ delta, fps: 1 / delta, realDelta })
})
