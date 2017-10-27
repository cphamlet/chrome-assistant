var items = { 
    objs : [] 
};

//Define task object:

//"element_html" : <html here>
//"entered_text" : This is the text the professor entered

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.command == "get"){
      sendResponse({msg: "Background: sending element from background script", taskObj:items.objs.shift()});
    }else if (request.command == "send"){
    	items.objs.push({"element_html" :request.element, "entered_text": request.enteredText});
    	console.log(request.element);
    	sendResponse({msg: "Background: Message received", enteredText:request.enteredText});
    }
  });

