const jsConsole = (()=>{
	const {warn,error,info,debug} = globalThis.console
	globalThis.console.log = debug;
	return {warn,error,info,debug}
})()

console.error = (...err) => {
jsConsole.error(...err)
	// TODO
	//quickTextPrompt("Error",err.join (" "))
}
