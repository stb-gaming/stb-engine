import {createMenuButton} from './menubar.js';
import {createPanel} from './panel.js';




const panel = createPanel({
		id:"settings",
		title: "Engine Systems",
		single: true,
		pinnable: false,
		dontopen:true,
		onopen:()=>{
			console.debug("hi")
		}

	})

function spawnSettings() {
	panel.open()
}
createMenuButton("Systems",spawnSettings)
