import {setupDragging} from './editor/drag'
const getEl = q=>document.querySelector(q);

import {toHTML,htmlTag,getElementPosition,setElementPosition} from "./editor/html";
import {createForm,getFormData} from './editor/form';
import {getPromptBody,createPrompt,openPrompt,closePrompt,quickTextPrompt,quickFormPrompt} from './editor/prompt';

import "./editor/not-features"

const createSpriteSchema = {
	url:{
		label:"Sprite URL",
		value:"assets/img/ball.png"
	},
	"":{type:"submit",value:"Create"}
}


getEl("#createSprite").addEventListener("click",()=>{
	//const url = prompt("SpriteURL","assets/img/ball.png")

	quickFormPrompt("Sprite URL",createSpriteSchema,({url})=>{
		let s = createSprite(url)
		console.log(s)
		setupDragging(s)
		globalThis.sprite = s;
	})

})

const app = createRenderer();
setupDragging(app);


function createTestPromptBody() {

	return toHTML(`
		<p>Prompt Text</p>
		<h2>Buttons and Links</h2>
		<ul>
			<li><a>anchor</a></li>
			<li><a href="">link</a></li>
			<li><a class="btn" href="">link button</a></li>
			<li><button>button</button></li>
			<li><input type="button" value="hm"></li>
			<li><input type="submit"></li>
			<li><input type="reset"></li>
		</ul>
	`)
}
const testPrompt = createPrompt("HELLO WORLD")
const promptBody = getPromptBody(testPrompt)
promptBody.append(...createTestPromptBody())

getEl("#openPrompt").addEventListener("click",()=>{
openPrompt(testPrompt)
})




const schema = {
	"color":{label:"Color"},
	"foodTime":{type:"number",label:"Time since food"},
	"happy":{value:false,label:"Happy"},
	"":{type:"submit",value:"Done"}
}


const form = createForm(schema)

form.querySelector("[type=submit]").addEventListener("click",()=>{
	//prompt("Here it is",JSON.stringify(getFormData(form)));
	const data = getFormData(form);
	quickFormPrompt("Here it is",{"":{value:data}})
})


const formPrompt = createPrompt("form test")
const formPromptBody = getPromptBody(formPrompt)
formPromptBody.appendChild(form)

getEl("#openFormPrompt").addEventListener("click",()=>{
openPrompt(formPrompt)
})



Object.assign(globalThis,{
	createPrompt,
	openPrompt,
	closePrompt,
	getFormData,
	quickTextPrompt,
	quickFormPrompt,
	setElementPosition,
	getElementPosition
})




