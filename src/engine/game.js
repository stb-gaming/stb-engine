let game = {}

if (Object.hasOwn(globalThis, "STB_EDITOR")) {
	game = globalThis.STB_EDITOR.game ??= game;
}
globalThis.game = game;
export { game };
