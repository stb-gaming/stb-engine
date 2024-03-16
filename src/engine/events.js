"use strict";
import {game} from './game.js'
(()=>{
	if(Object.hasOwn(globalThis,"STB_EDITOR")) {
		STB_EDITOR.createSystem({
			// System ID
			id:"events-system",
			//System Icon
			// img:"https://avatars.githubusercontent.com/u/583231",
			/// System Name
			title:"Events",
			// System Description
			summary:"Manages game events",
		});
	}

	const events = game.events = ??= {};



})();
