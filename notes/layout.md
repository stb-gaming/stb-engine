* scenes
	* components
	* entities
* sytems
	* events

## engine

```
//Graphics 
createEntity()
applyComponent()
createSprite(url)//entity
createText(text)//entity
createGroup()//entity
createScene(name)
addEntity(scene/group,entity)

applyBackground(state,url)
spawnEntity

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
## events.js
manage events

## scenes.js
manage entities and components


## Events
* createEvent - when an event is created

* awake - instanciated
* onenable
* reset - editor
* start - game begin

* frameBegin
* update
* fixedupdate
* lateupdate
* frameEnd

* end - game end
* disable - entity disable
* destroy - entity destroy
