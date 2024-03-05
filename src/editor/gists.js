import {evalJS,fetchText,loadJS} from "./externs"

const externs = [];


export function createGistURL(user,gist,revision,file) {
	/*
	https://gist.githubusercontent.com/tumble1999/39eccd41a251e17f3454edcde0ce09d3/raw/6468653aa0e30a7aa62ee418d64632bda9893f6a/test.js
	https://gist.githubusercontent.com/
	USER:tumble1999/
	GIST:39eccd41a251e17f3454edcde0ce09d3/
	raw/
	REVISION: 6468653aa0e30a7aa62ee418d64632bda9893f6a/
	FILE: test.js
	*/

	let url = `https://gist.githubusercontent.com/${user}/${gist}/raw/`
	if(revision) url += revision + "/";
	if(file) url += file
	return url;
}

export function getLoadedGists() {
	return externs;
}

export function getGistInfo(url) {
	const regex = /https:\/\/gist\.githubusercontent\.com\/([^\/\t\n\r]+)\/([^\/\t\n\r]+)\/raw\/?([^\/\t\n\r]+)?\/?([^\/\t\n\r]+)?/
	let [_,user,id,rev,file] = regex.exec(url);

	return {user,id,rev,file}
	
}
export async function importGist(url) {
	const text = await fetchText(url)
	const element = evalJS(text);
	let i = externs.push({
		...getGistInfo(url),
		element
	})-1;
	return i;
}
