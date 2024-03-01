

//CORE
const game = (() => {
  const game = { events: {} };

  game.createEvent = (name) => {
    if (!name || typeof name !== "string") {
      console.error(`Invalid event name`);
      return;
    }

    const eventCallbacks = (game.events[name] = []);
    Object.defineProperty(game, name, {
      enumerable: true,
      set: (cb) => eventCallbacks.push(cb),
      get: () => (...args) => eventCallbacks.forEach((cb) => cb(...args)),
    });

    console.debug(`Created event ${name}`);
  };


  game.createEvent("changeState");
  game.createEvent("entityCreated");
  game.createEvent("addComponent");
      
    game.createEntity = () => {
    if (!game.state) return console.error("Game in an invalid state");
      const state = game.current;
      const entities =state.entities;
      const id = entities.removed.shift() || entities.length++;
      game.entityCreated(id);
      console.debug(`Created entity ${id}`);
      game.createEvent("removeEntity");
      return id;
    };

    game.registerComponent = (name) => {
    if (!game.state) return console.error("Game in an invalid state");
      const state = game.current;
      const components = state.components;
      if (typeof name !== "string" || !name || components.hasOwnProperty(name)) {
        return console.error(`Invalid component name`);
      }

      components[name] = Array.from({ length: state.entities.length }, () => null);
      console.debug(`Registered component ${name}`);
      
      return components[name];
    };

    game.getComponent = (id) => (component, value) => {
    if (!game.state) return console.error("Game in an invalid state");
      const currentState = game.current;
      if (currentState && currentState.components[component]) {
        if (value !== undefined) currentState.components[component][id] = value;
        else return currentState.components[component][id];
      } else {
        console.error(`Invalid component or entity ID`);
      }
    };

    

        game.changeState = (name) => {
          if (typeof name === "string" && !!name.length) {
            const states = (game.states = game.states || {});
            if (!states.hasOwnProperty(name)) {
               const state = (states[name] = { components: {}, entities: { removed: [] } });
				Object.defineProperty(state.entities, "length", {
				  enumerable: true,
				  get: () => Object.values(state.components)?.[0]?.length || 0,
				  set: (n) => Object.values(state.components).forEach((a) => (a.length = n)),
				});
				console.debug(`Created state ${name}`);            }
            game.state = name;
            game.previous = game.current;
            game.current = game.states[name];
            console.debug(`Changed game state to ${name}`);
          }
        };
        
        game.removeEntity = (id) => {
          if (!game.state) return console.error("Game in an invalid state");
          const entities = game.current.entities;
          if (entities.removed.includes(id)) return console.warn(`Entity ${id} has already been removed`);
          if (entities.length <= id) return console.warn(`Entity ${id} exceeds the current entity count`);
          entities.removed.push(id);
        };


  return game;
})();


//RENDERING
game.renderer = (()=>{
	const ensureApp = () => {
		if(renderer.app) return
		console.debug("Creating app")
		const app = renderer.app = new PIXI.Application({resizeTo:window})
		app.stage.name = "[GAME]"
		globalThis.__PIXI_APP__ = app;
		document.body.appendChild(app.view)
	}
	
	const ensureGameLoop = () => {
		ensureApp();
		const app = renderer.app;
		if(app.ticker.listeners>1) return
		console.debug("Setting up gameloop")
		app.ticker.add(dt=>{
			game.onRender(dt);
			game.update(dt);
			game.lateUpdate(dt);
		})
	}
	const renderer = {
		ensureApp,
		ensureGameLoop
	};

	const createSprite = (img)=> {
		console.debug("Creating sprite",img)
		return  PIXI.Sprite.from(img);
	}
	
	const createText = (text,options= { fontSize: 30, fill: 'white' }) => {
		console.debug("Creating text",text)
		return new PIXI.Text(text,options)
	}

	game.changeState = ()=>{
		game.createEvent("onRender")
		game.createEvent("update")
		game.createEvent("lateUpdate")
	}

	game.addComponent = (entityId,componentId,type,...params)=> {
		if(componentId!== "sprite") return;
		if(!renderer.sprites) renderer.sprites = game.registerComponent("sprite")
		const sprite = {
			sprite:createSprite,
			text:createText
		}[type](...params);
		if(renderer.sprites)renderer.sprites[entityId] = sprite
	}


	
	
		
	return renderer
})()

game.input = (()=>{
	const inputHandler = e => {
		const key = e.key.toLowerCase()
		const input = game.input
	    input.value = { ...(input.value || {}), [key]: e.type === "keydown" };
	    input.events = input.events || {};
	    input.events[e.type] = [...(input.events[e.type] || []), key];
	};


	const ensureInput = () => {
	    if (game.input.setup) return;
	    console.debug("Setting up input handling");
	    document.addEventListener("keydown", inputHandler);
	    document.addEventListener("keyup", inputHandler);
	    game.input.setup = true;

	    
		game.lateUpdate = delta => {
		    if (!game.input|| !game.input.events) return;
			const input = game.input
		    input.previousEvents = { ...input.events };
		    input.events = {};
		};
	};

	const checkKeyState = (keys, type) => {
	    ensureInput();
	    if (!Array.isArray(keys)) keys = [keys];
	    return keys.some(k => game.input[type]?.[k.toLowerCase()] || false);
	  };
	
	  const keyDown = keys => checkKeyState(keys, 'value');
	  const keyPressed = keys => checkKeyState(keys, 'events.keydown');
	  const keyReleased = keys => checkKeyState(keys, 'events.keyup');

	return {keyDown,keyPressed,keyReleased,
	SKY_REMOTE: {
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
	}
})();

// Player Controller
(()=>{

	const playerControllers = {};


		game.addComponent = (entityId,componentId,type,...params)=> {
			if(componentId!== "sprite") return;
			if(!playerControllers.hasOwnProperty("debug")) playerControllers.debug = game.registerComponent("debugController")
			playerControllers.debug[entityId] = {speed:3}
		}

})()

// API
game.api = (()=>{
	const api = {
		getArrowX() {
			const {keyDown,SKY_REMOTE} = game.input
			return keyDown(SKY_REMOTE.right)-keyDown(SKY_REMOTE.left)
		},
		getArrowY() {
			const {keyDown,SKY_REMOTE} = game.input
			return  keyDown(SKY_REMOTE.down)-keyDown(SKY_REMOTE.up)
		},
		setState(name) {
			game.changeState(name)
		},
		setBG(url) {
			
		},
		createSprite() {
			
		},
		createText() {
			
		},

		gameJSON(gameData) {
			
		}
		
	}

	Object.assign(window,api)
	return api;
})()

