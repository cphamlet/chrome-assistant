var items = { 
    objs : [] 
};
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.command == "get"){
      sendResponse({msg: "Background: sending element from background script", element:items.objs.shift()});
    }else if (request.command == "send"){
    	items.objs.push(request.element);
    	console.log(request.element);
    	sendResponse({msg: "Background: Message received"});
    }
  });

