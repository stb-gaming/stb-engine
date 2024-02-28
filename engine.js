const game = {}




const onEvent = (entity={},type="",cb,onListen)=>{
	console.debug("Registering event listener",type)
	entity.events = entity.events || new Map();
	entity.events.set(type, [...(entity.events.get(type) || []), cb]);
	if(onListen) onListen(entity,type,cb)
}

const callEvent = (entity={},type="",...args)=>{
	const events = entity.events?.get(type) ||[];
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

const keyDown = k =>{
	ensureInput();
	return game.input.value?.[k.toLowerCase()]||false
}
const keyPressed = k => {
	ensureInput();
	game.input.events?.keydown?.includes(k.toLowerCase())||false
}

const keyReleased = k => {
	ensureInput()
	game.input.events?.keyup?.includes(k.toLowerCase())||false
}


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

const createSprite = (img, container)=> {
	console.debug("Creating sprite",img)
	const sprite = PIXI.Sprite.from(img);
	if(container !== null){
		ensureApp();
		const app = game.app;
		container = container||game.current?.container||app.stage
		container.addChild(sprite);
	}
	return sprite
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
	if(container !== null){
		ensureApp();
		const app = game.app;
		container = container||game.current?.container||app.stage
		container.addChild(entity);
	}
	return entity
}


const makeDynamic = (entity={})=> {
	createEvent(entity,"spawn")
	createEvent(entity,"update")
	createEvent(entity,"despawn")
	return entity;
}

const createGroup = parent => {
	const container = new PIXI.Container();
	if(parent !== null&&!game.app){
		ensureApp();
		const app = game.app;
		parent = parent||game.current?.container||app.stage
		parent.addChild(container);
	}
	return container
	
}

const createState = (name,init=()=>{})=>{
	game.states = game.states||new Map();
	if(game.states.has(name)) return	
	console.debug("Creating game state",name)

	const state = {
		container: createGroup(null)
	};
	state.container.name =`[STATE CONTAINER] ${name}`
	game.states?.set(name,state);
	makeDynamic(state)

	if(!game.current) setState(name)

	return state;	
}


const setState = name =>{
	console.debug("Setting game state to",name)
	createState(name)
	const state = game.states.get(name)
	game.current?.despawn()
	game.current = state;
	if(game.current?.container) {
		ensureApp();
		const app = game.app;
		app.stage.removeChildren();
		app.stage.addChild(game.current.container)
	}
	game.current?.spawn();
	ensureGameLoop();
	if(game.update){}
}

//TDOD MENU OPTIONS WITH SPRITES
const createMenu = (name="menu")=>{
	const state = createState(name);
	const menuContainer = createGroup(state.container);

	return {
		state
	}
}
