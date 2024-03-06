let dragging,app,anchor;

function saveAnchor(sprite) {
	const {x,y} = sprite.anchor;
	anchor = [x,y]
}
function loadAnchor(sprite) {
	if(anchor) {
		const {x,y} = sprite.anchor
		
		sprite.anchor.set(...anchor)
		counteractReposition(sprite,[x,y],anchor);
	}
}

function counteractReposition(sprite,oldAnchor,newAnchor) {
	const anchorDif = [
		newAnchor[0]-oldAnchor[0],
		newAnchor[1]-oldAnchor[1]
	];
	const posChange = [
		anchorDif[0]*sprite.width,
		anchorDif[1]*sprite.height
	]
	sprite.x += posChange[0]
	sprite.y += posChange[1]
}

function setDragAnchor(sprite,mouse) {
	//console.debug("sprite",sprite.x,sprite.y,sprite.width,sprite.height);
	//console.debug("mouse",mouse)
	const l = [mouse.x-sprite.x, mouse.y-sprite.y]
	//console.log("mouseToSprite",l)
	const newAnchor = [l[0]/sprite.width,l[1]/sprite.height];
	//console.debug("newAnchor",newAnchor)
	sprite.anchor.set(...newAnchor)
	counteractReposition(sprite,anchor,newAnchor)
}



function dragStart({global:mouse}) {
	saveAnchor(this)
	setDragAnchor(this,mouse)
	this.alpha = .5;
	dragging = this;
	app.stage.on('pointermove',dragMove)
	console.debug("dragStart",dragging)
}

function dragMove({global:mouse}) {
	if(dragging) {
		//console.debug("dragMove",dragging)
		dragging.parent.toLocal(mouse,null,dragging.position)
	}
}

function dragEnd() {
	if(dragging) {
		console.debug("dragEnd",dragging)
		app.stage.off('pointermove',dragMove)
		dragging.alpha = 1;
		loadAnchor(dragging)
		dragging = null;
	}
}


export function setupDragging(entity) {
	console.debug("setupDragging",entity)
	if(entity.stage) {
		app = entity
		entity = app.stage;
	    app.stage.hitArea = app.screen;
	    app.stage.on('pointerup', dragEnd);
	    app.stage.on('pointerupoutside', dragEnd);
	} else {
		entity.cursor = 'pointer';
        entity.on('pointerdown', dragStart, entity);
	}
    entity.eventMode = 'static';
}
