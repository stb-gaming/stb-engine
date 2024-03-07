document.addEventListener('keydown', function (event) {
    // Check if the Ctrl key is pressed (or Command key on Mac)
    const isCtrlKey = (event.ctrlKey || event.metaKey);

    // Check for "Z" key (Undo)
    if (isCtrlKey && event.key === 'z') {
      document.dispatchEvent(new Event('undo'));
    }

    // Check for "Y" key (Redo)
    if (isCtrlKey && event.key === 'y') {
      document.dispatchEvent(new Event('redo'));
    }
  });


const singleUsePrompts = {}

document.addEventListener("dragover",()=>{
    event.preventDefault();
    if(!singleUsePrompts.drag)
	singleUsePrompts.drag = quickTextPrompt("Oh, hello","Are you sure you want to do that?")
})
document.addEventListener("drop",()=>{
    event.preventDefault();
	closePrompt(singleUsePrompts.drag)
	singleUsePrompts.drag = null
	quickTextPrompt("Feature Unavailable","I don't think I want to have an upload files system just yet. Just use <a href=\"https://imgur.com/\" target=\"_blank\">Imgur</a> or discord message or something.")
})


document.addEventListener("cut",()=>{
	quickTextPrompt("Feature Unavailable","Cut,hmmm")
	
})
document.addEventListener("copy",()=>{
	quickTextPrompt("Feature Unavailable","Copy, could be usefule, yes")
	
})
document.addEventListener("paste",()=>{
	quickTextPrompt("Feature Unavailable","Paste, could be for sprite urls or just entities in general")
	
})
document.addEventListener("undo",()=>{
	quickTextPrompt("Feature Unavailable","Ok yes, undo would be good. Probablye have to keep track of a event history though,")
	
})
document.addEventListener("redo",()=>{
	quickTextPrompt("Feature Unavailable","For my thoughts on redo, see 'undo'")
	
})
