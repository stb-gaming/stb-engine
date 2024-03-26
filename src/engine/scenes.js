import { callEvent, emitEvent, onEvent } from "./events";
/*
 * # events
 * createScene
 * changeScene
 * createEntity
 * addComponent
 *
 * # functions
 * chnageScene
 * createEntity
 * removeEntity
 * registerComponent
 * getComponent
 *
 */

if (Object.hasOwn(globalThis, "STB_EDITOR")) {
	STB_EDITOR.createSystem({
		id: "scenes",
		title: "Scenes, Entities and Components",
		summary: "Scenes, Entities and Components",
		panel: {
			title: "Scene",
			fn: body => {
				const form = STB_EDITOR.createForm({
					scene: {
						value: "main",
						type: "datalist"
					},
					submit: false
				})
				body.appendChild(form)
				const list = STB_EDITOR.createHTML(`
					<div id="Entity list" class="scroll-list">
					</div>
					`,)
				body.appendChild(list)

			}
		}
	});


}



export function changeScene(name) {
	if (typeof name !== "string" && !name.length) {
		return console.error("Invalid state name", name)
	}
	const scenes = game.scenes ??= {};
	if (!Object.hasOwn(scenes, name)) {
		scenes[name] = {
			components: {},
			entities: {
				removed: [],
				get length() {
					return Object.values(scene.components)?.[0]?.length || 0;
				},
				set length(n) {
					for (const component of Object.values(scene.components)) {
						component.length = n
					}
				}
			}
		}
		console.debug(`Created new scene ${name}!`);
		emitEvent("createScene", name);
	}
	const scene = scenes[name];
	game.previous = game.current;
	game.current = scene;
	console.debug(`Changed scene to ${name}`)
	emitEvent("changeScene", name)
}


export function createEntity() {
	if (!game.current) changeScene("main");
	const scene = game.current;
	if (!Object.keys(scene.components).length) return console.error("Entities cannot be created until there are components in the scene")
	const entities = scene.entities;
	const id = entities.removed.shift() || entities.length++;
	console.debug(`Created entity ${id}`);
	callEvent("entityCreated", id)
	return id;
}


export function removeEntity(id) {
	if (!game.current) changeScene("main");
	const entities = game.current.entities;
	if (entities.removed.includes(id)) return console.warn(`Entity ${id} has already been removed`);
	if (entities.length <= id) return console.warn(`Entity ${id} exceeds the current entity count`);
	entities.removed.push(id);
	callEvent("removeEnity", id)
};




export function createComponent(name) {
	if (!game.current) changeScene("main");
	const scene = game.current;
	const components = scene.components;
	if (typeof name !== "string" || !name || components.hasOwnProperty(name)) {
		return console.error(`Invalid component name`);
	}

	components[name] = Array.from({ length: scene.entities.length }, () => null);
	console.debug(`Created component ${name}`);

	return components[name];
};

export function getComponent(id) {
	return (component, value) => {
		if (!game.current) changeScene("main");
		const scene = game.current;
		if (scene && scene.components[component]) {
			if (value !== undefined) scene.components[component][id] = value;
			else return scene.components[component][id];
		} else {
			console.error(`Invalid component or entity ID`);
		}
	};
};

export function addComponent(componentId, entityId = game.current?.entities.length || 0, ...args) {
	if (!game.current) changeScene("main");
	const scene = game.current;
	const components = scene.components;
	if (!components[componentId]) createComponent(componentId)
	if (scene.entities.length <= entityId) entityId = createEntity();
	callEvent("addComponent", entityId, componentId, ...args)
	console.debug(`Attached component ${componentId} to enity ${entityId}`);
}
