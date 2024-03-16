let game = {}

if(Object.hasOwn(globalThis,"STB_EDITOR")) {
	game = globalThis.STB_EDITOR.game
} else {
	globalThis.game = game;
}


export game;
