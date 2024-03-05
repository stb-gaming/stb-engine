# Editor
* center canvaa
* modular sidebars
* dialogues
* gist plugins https://gist.githubusercontent.com/{USER/GISTID}/raw
* local storage
* local storage

## public api
the  function engine should follow a similar philosophy as p5.js, simple funtionctions tgat do a whole lot in tge background.

Also i should try and reduce how much beeds to be directly coded into the game loop by the developer outside of system creation.

### example functions to have
```
//Graphics 
createSprite(url)
createGroup()
createState(name)
createText(text)
applyBackground(state,url)

//Logic and cotrollers
applyPlatformerController(entity)
applyTopDownController(entity)


//input buttons: red,green,yellow,blue, numbers,select,backup
buttonDown(button)
buttonPressed(button)
buttonReleased(button)
arrowButtonX()
arrowButtonY()

//physics
gravity(number)
applyGravity(entity)
applyForce(entity,direction,amount)

//menus
createMenu(type) // directional, colors
addOption(menu,entity,state/menu,position) //position is x,y position in menu not coordonates

//misc
createInfoPanel(text,bg) //help


//editor exclusive
loadGist()
prompt(promptData)
exportHtml()
exportGist()
```

## sprites and assets
code can be loaded via gist or userscrips or even js developer console, thats fine
fine.

its stuff like images that could be interesting, file upload might be hard so we may have to resort to imgur or discord or mahbe gist if that works.

## json
everything about game should beable to be represented in json format.

## plugins
people knowlegeable about code should beable to create code that would add systems and useful logic to the game

## esc 

after playing about and doing research, i have deiced that a ESC aproach could be best, and events to

## share
creates code that could be put in a gist, then you give that gist url back to the site to give you a link you cab use to share the game
this should make it easier for people who dont want to have to setup a whole website.
there should also be a video on how to create a gist
```
loadGame({
gists:[],
...
})
```
potential url format for sharing games

`/stb-engine?gist=user/abc123/rev1234/file.js`
## export
creates code that can then be placed on a website