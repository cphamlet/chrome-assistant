var x = 0;
var y = 0;
$(window).mouseover(function(e) {
    x = e.clientX, y = e.clientY;
});

$(document).keydown(function(event) {
    switch(event.which) {
        case 37: // left
        alert("Entering Key Left");
        elementOnMouseOver = document.elementFromPoint(x, y);
            if(elementOnMouseOver.style.border == "" && elementOnMouseOver.tagName != "input"){
    			elementOnMouseOver.style.border = "thick solid green";
                chrome.runtime.sendMessage({command: "send", element:elementOnMouseOver.outerHTML}, function(response) {
                     alert(response.msg);
                  //   var g = JSON.parse(elementOnMouseOver);
                  //   g.style.border = "thick solid red";
                });
   			}
    		else{
      			elementOnMouseOver.style.border = "";
    		} 
                //alert(elementOnMouseOver.html);
    			//$(elementOnMouseOver.target).append("<div contenteditable='true' class='draggable' style='width:250px'><textarea type='text' rows='2' cols='1' value='Description'></textarea><a href='#' class='button postfix' style='float:right'>Save</a></div>");
        		$(elementOnMouseOver).append("<div contenteditable='true' class='draggable' style='width:250px'><textarea type='text' rows='2' cols='1' value='Description'></textarea><button type='button' style='color:blue;background: green'>ZTest</button></div>");
                break;
        case 40:
        chrome.runtime.sendMessage({command: "get"}, function(response) {
            alert(response.msg);
            alert(response.element);
            var elements = document.getElementsByTagName("*");

            for (var i = 0, element; element = elements[i++];) {
                if(element.outerHTML == response.element){
                    alert("item found");
                    element.style.border = "thick solid green";
                }
            }
        });
            break;

       		}

    });