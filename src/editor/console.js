const jsConsole = (()=>{
	const {warn,error,info,debug} = globalThis.console
	globalThis.console.log = debug;
	return {warn,error,info,debug}
})()


import {quickTextPrompt,quickFormPrompt} from './prompt';

console.error = (...err) => {
jsConsole.error(...err)
	quickTextPrompt("Error",err.join (" "))
}
