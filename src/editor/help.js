import { createMenuButton } from './menubar.js';
import { createPanel } from './panel.js';
import { createHTML } from './html.js';


// const menuBarItems = document.querySelector(".menubar"))


export function createBinding(name, ...newBinds) {
	const id = "help-" + name.replace(/\W+/g, "-").toLowerCase();
	const row = helpContent.querySelector("#" + id) || createHTML(`<tr id="${id}"></tr>`)
	if (row.parentNode instanceof DocumentFragment) helpContent.appendChild(row)
	const oldBinds = Array.from(row.querySelectorAll(":not(:first-child)"), row => row.textContent)
	const binds = new Set([...oldBinds, ...newBinds])
	// console.debug(binds)
	row.innerHTML = [name, ...binds].map(v => `<td>${v}</td>`).join("");
}

const panel = createPanel({
	id: "help",
	title: "Help",
	single: true,
	pinnable: false,
	dontopen: true,
	html: `<table><tr><th>Action</th><th>Key</th></tr></table><p>More help and tutorials <a href="https://github.com/stb-gaming/stb-engine/wiki">here</a>.</p>`
})
const helpContent = panel.element.querySelector("table")
document.addEventListener("keydown", e => {
	if (e.ctrlKey) {
		if (e.key === "/") panel.open()
	}
})

createMenuButton("📚 Help", panel.open)
createBinding("Help", "Ctrl+/")
