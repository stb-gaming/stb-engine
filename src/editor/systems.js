import { createMenuButton } from './menubar.js';
import { createPanel } from './panel.js';
import { createHTML } from './html.js';
import { STB_EDITOR } from './STB_EDITOR';
import { defined, fn } from './util.js';


const systems = {};

const panel = createPanel({
	id: "settings",
	title: "Engine Systems",
	single: true,
	pinnable: false,
	dontopen: true,
	html: `<div id="engine-settings">
			<div id="system-list" class="scroll-list">
			</div>
			</div>
			`,

})
const listElement = panel.element.querySelector("#system-list")

createHTML({

	id: "system-null",
	base: "<span class='system-none'>There is nothing here.</span>",
})



createHTML({
	id: "scroll-list-item",
	base: `<button>
			<img src="assets/img/ball.png"/>
			<strong class="title">Hello World</strong>
			<small class="summary">Example System</small>
		</button>`,
	query: {
		tab: 'button',
		img: "img",
		title: '.title',
		summary: '.summary'
	},
	cb: (_, el, { title = "Sample System", summary = "This is a placeholder", img = "assets/img/ball.png", panel,click }) => {		console.warn("HELLO", panel)
		el.img.src = img;
		el.title.innerText = title;
		el.summary.innerText = summary;
		if (panel) {
			panel.title ??= title;
			
			el.tab.addEventListener("click", () => {
				createPanel(panel)
			})
		}
		if(click) {
			el.tab.addEventListener("click", fn(click))
		}
	}
})




createMenuButton("Systems", panel.open)

export function createSystem(system) {
	if (Object.hasOwn(system, "id") && !Object.hasOwn(systems, system.id)) {
		systems[system.id] = system;
		console.debug("Registered new system", system)
	}
	system.tab = createHTML({ base: "scroll-list-item", args: system })
	system.tab.dataset.id = system.id;
	system.remove = () => {
		system.tab.remove();
	}
	listElement.appendChild(system.tab)
}


