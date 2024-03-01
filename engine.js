const game = {}
const SKY_REMOTE = {
	up:["i","arrowup"],
	down:["k","arrowdown"],
	left:["j","arrowleft"],
	right:['l','arrowright'],
	select:[' ','enter'],
	backup:'backspace',
	red:'q',
	green:'w',
	yellow:'e',
	blue:'r',
	help:'t',
}



const onEvent = (entity={},type="",cb,onListen)=>{
	console.debug("Registering event listener",type)
	entity.events = entity.events || {};
	entity.events[type] =  [...(entity.events[type] || []), cb];
	if(onListen) onListen(entity,type,cb)
}

const callEvent = (entity={},type="",...args)=>{
	const events = entity.events?.[type] ||[];
	events.forEach(cb=>cb(...args));
}
const createEvent = (entity={},type="",onListen) => 
	Object.defineProperty(entity,type,{
		enumerable: true,
		get: ()=>(...args)=>callEvent(entity,type,...args),
		set: cb => onEvent(entity,type,cb.bind(entity),onListen)
	});



const inputHandler = e => {
	const key = e.key.toLowerCase()
	const input = game.input
    input.value = { ...(input.value || {}), [key]: e.type === "keydown" };
    input.events = input.events || {};
    input.events[e.type] = [...(input.events[e.type] || []), key];
};
const refreshInputs = delta => {
    if (!game.input|| !game.input.events) return;
	const input = game.input
    input.previousEvents = { ...input.events };
    input.events = {};
};


const ensureInput = () => {
    if (game.input) return;
    console.debug("Setting up input handling");
    document.addEventListener("keydown", inputHandler);
    document.addEventListener("keyup", inputHandler);
    game.input = {};
};

const keyDown = keys =>{
	ensureInput();
	if(!Array.isArray(keys)) keys = [keys]
	return keys.some(k=>game.input.value?.[k.toLowerCase()]||false)
}
const keyPressed = keys => {
	ensureInput();
	if(!Array.isArray(keys)) keys = [keys]
	return keys.some(k=>game.input.events?.keydown?.includes(k.toLowerCase())||false)
}

const keyReleased = keys => {
	ensureInput()
	if(!Array.isArray(keys)) keys = [keys]
	return keys.some(k=>game.input.events?.keyup?.includes(k.toLowerCase())||false)
}

const getArrowX = () => keyDown(SKY_REMOTE.right)-keyDown(SKY_REMOTE.left)
const getArrowY = () => keyDown(SKY_REMOTE.down)-keyDown(SKY_REMOTE.up)


const ensureGameLoop = () => {
	ensureApp();
	const app = game.app;
	if(app.ticker.listeners>1) return
	console.debug("Setting up gameloop")
	app.stage.name = "[GAME]"
	globalThis.__PIXI_APP__ = app;
	app.ticker.add(dt=>{
		if(game.current) {
			game.current.update(dt)
		} else {
			game.update(dt)
		}
		refreshInputs(dt)
	})
}


const ensureApp = () => {
	if(game.app) return
	console.debug("Creating app")
	game.app = new PIXI.Application({resizeTo:window})
	document.body.appendChild(game.app.view)
	createEvent(game,"update",()=>{
		ensureGameLoop()
	})
}

const spawnEntity = (entity,container)=>{
	console.debug("Spawning entity", entity)
	if(container && typeof container == "object" && container.hasOwnProperty("container")) {
		container = container.container
	}
	if(container !== null) {
			ensureApp();
			const app = game.app;
			container = container||game.current?.container||app.stage
			container.addChild(entity);
	}
	return entity
}

const despawnEntity = entity =>{
	if(entity?.parent) {
		entity.parent.removeChild(entity)
	}
}

const createSprite = (img, container)=> {
	console.debug("Creating sprite",img)
	const sprite = PIXI.Sprite.from(img);
	return spawnEntity(sprite,container)
}

const createText = (text,container) => {
	console.debug("Creating text",text)
	const textEntity = new PIXI.Text(text, { fontSize: 30, fill: 'white' })
	return spawnEntity(textEntity,container)
}

const trycatch = fn =>{
	try {
		return [fn(),null];
	} catch(err) {
		return [null,err]
	}
}

const createEntity = (url,container) =>{
	console.debug("Creating entity",url)
	const [texture,error] = trycatch(()=>PIXI.Texture.from(url))
	// console.log(texture)
	const entity = error
				?new PIXI.Text(url, { fontSize: 30, fill: 'white' })
				:new PIXI.Sprite(texture)
	
	return spawnEntity(entity,container)
}


const makeDynamic = (entity={})=> {
	createEvent(entity,"spawn")
	createEvent(entity,"update")
	createEvent(entity,"despawn")
	return entity;
}

const createGroup = parent => {
	const container = new PIXI.Container();
	return spawnEntity(container,parent)
	
}

const createState = (name,init=()=>{})=>{
	game.states = game.states||{};
	if(game.states.hasOwnProperty(name)) return	
	console.debug("Creating game state",name)

	const state = {
		container: createGroup(null)
	};
	state.container.name =`[STATE CONTAINER] ${name}`
	game.states[name] = state;
	makeDynamic(state)

	if(!game.current) setState(name)

	return state;	
}


const setState = name =>{
	console.debug("Setting game state to",name)
	createState(name)
	const state = game.states[name]
	game.current?.despawn()
	game.current = state;
	if(game.current?.container) {
		ensureApp();
		const app = game.app;
		app.stage.removeChildren();
		spawnEntity(game.current.container,app.stage)
	}
	game.current?.spawn();
	ensureGameLoop();
	if(game.update){}
}

const addMenuOption = (menu, entity, action) => {
	console.log("Adding menu option",{menu,entity,action})
	const y = menu.container.height
	despawnEntity(entity)
	
	spawnEntity(entity,menu)
//	entity.y = menu.endY;
	//menu.endY += entity.height;
	entity.y = y;;
}

//TDOD MENU OPTIONS WITH SPRITES
const createMenu = (name="menu")=>{
	console.debug("Creating menu",name)
	const state = createState(name);
	const container = createGroup(state);

	state.update = dt =>{
		if(keyReleased(SKY_REMOTE.down)) {
			console.log("down")
		}
		if(keyReleased(SKY_REMOTE.up)) {
			console.log("up");
		}
		if(keyReleased(SKY_REMOTE.select)) {
			console.log("select");
		}
	}

	const menu =  {
		state,
		container,
		endY:0,
		get options() {return container.children },
		addOption: (entity,action)=>addMenuOption(menu,entity,action)
	}

	return menu;
}

