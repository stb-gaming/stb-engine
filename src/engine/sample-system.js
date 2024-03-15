(()=>{
	if(Object.hasOwn(globalThis,"STB_EDITOR")) {
		STB_EDITOR.createSystem({
			// System ID
			id:"my-new-system",
			//System Icon
			img:"https://avatars.githubusercontent.com/u/583231",
			/// System Name
			title:"An Excelent System",
			// System Description
			summary:"This is a sample game system",
			// In-editor confic
			settings:{
				base:`<p>This is a new system</p>`,
			},
		});
		// Initialize Editor Stuff
		console.info("Hello Editor");
	}

	// Game Engine Stuff
	console.info("Hello Engine");

})();
