import {createHTML,spawnElement} from "./html";
import {createSystem} from './systems';
import {createForm} from './form';




async function fetchText(url) {
	const response = await fetch(url)
	return await response.text()
}


function createGistURL(gist) {
	let url = `https://gist.githubusercontent.com/${gist.user}/${gist.id}/raw/`
	if(gist.revision) url += gist.revision + "/";
	if(gist.file) url += gist.file
	return url;
}

function getLoadedGists() {
	return externs;
}

function getGistInfo(url) {
	if(!url.startsWith("https:")) {
		url = "https://gist.github.com/" + url
	}
	const regex = /https:\/\/gist.github.com\/([^\/\t\n\r]+)\/([^\/\t\n\r#]+)(?:\/([^\/\t\n\r#]+))?(?:(?:#file-)([^\/\t\n\r#]+))?/
	const regexRaw = /https:\/\/gist\.githubusercontent\.com\/([^\/\t\n\r]+)\/([^\/\t\n\r]+)\/raw\/?([^\/\t\n\r]+)?\/?([^\/\t\n\r]+)?/
	let [_,user,id,rev,file] = url.includes("gitusercontent") ? regexRaw.exec(url):regex.exec(url)

	return {user,id,rev,file}

}



export function importGist(url) {
    const gist = getGistInfo(url);
	if(Object.hasOwn(gist,"id")) url = createGistURL(gist)
	gist.element = document.createElement("script")
	fetchText(url).then(text=>gist.element.text = text)
	// gist.element.src = url
	document.body.appendChild(gist.element)
	STB_EDITOR.game.imports ??=[];
	STB_EDITOR.game.imports.push(gist.id?`${gist.user??""}/${gist.id??""}/${gist.rev??""}/${gist.file??""}`:url)
    return gist;
}


createSystem({id:"create-system",title:"Add System",summary:"Create or import a game system",settings:{
	base:`<p>
	This area, is still being made, check <a href="https://github.com/stb-gaming/stb-engine/wiki/%5BCODERS-ONLY%5D-Systems" >here</a> for more info.
	</p>`,
	cb:fragment=>{
		const form = createForm({
			gist:{
				value:"",
				label:"Gist URL"
			},
			submit:(values)=>{
				console.log(values)
			},
		})
		if(form instanceof Node) fragment.appendChild(form)
	}
}})
