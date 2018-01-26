var items = { 
    objs : [] 
};

//This global variable is meant to maintain the button state across refreshed pages. For example, when you
//advance to the next link, you will maintain the button on the bottom right.  
var load_status = false; 

//Define task object:

//"element_html" : <html here>
//"entered_text" : This is the text the professor entered

//This background listener listens for comamnds from the content script. The commands are:
//Get: this returns the first itme in the stack
//Send: This adds an item to the stack
//Save: For now all this does is return the entire stack jsonified. This will send to the server later
//Clear: This empties all of the items in the list. (Say )
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.command == "peek"){
      sendResponse({msg: "Background: sending element from background script", taskObj:items.objs[0]});
    }else if(request.command == "shift"){
      sendResponse({msg: "Background: sending element from background script, top item deleted", taskObj:items.objs.shift()});
    }else if (request.command == "send"){
    	items.objs.push({"element_html" :request.element_html, "entered_text": request.entered_text, "url": request.url});
    	console.log(request.element_html);
    	sendResponse({msg: "Background: Message received", enteredText:request.entered_text});
    }else if (request.command == "save"){
      sendResponse(JSON.stringify(items));
    }else if (request.command == "clear"){
      items = { objs : [] };
      sendResponse("CLEARED");
    }else if(request.command == "get-load-status"){
      sendResponse(load_status);
    }else if(request.command == "set-load-status"){
      load_status = !load_status;
      sendResponse(load_status);
    }


  });





