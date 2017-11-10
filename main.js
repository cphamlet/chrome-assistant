var x = 0;
var y = 0;
$(window).mouseover(function(e) {
    x = e.clientX, y = e.clientY;
});


var student_view_next = "null";


function create_popup_box(top, left, borderedElement){

var new_offset = {top:top, left:left};
    var new_width = 200;
    var new_height = 50;

    var created_element = $('<div class = "4k3jfn"></div>');
    var editable_text = $('<div contenteditable = "true" class ="56sdjfh"></div>');
    var save_button = $('<div class = "ck42jr"></div>');
    var button_text = $('<span class = "34ifun">Save</span>');
    save_button.append(button_text);

    editable_text.css({
        'background-color':'#ededed',
        'height'    : '40px'
    });
    save_button.css({
        'background-color' : '#00826c',
        'color'         : "white",
        'width'         : "75px",
        'height'        :"30px"
    });

    button_text.css({
        'margin': '10px 10px',
        'font-size': '24px'
    });

    created_element.append(editable_text);
    created_element.append(save_button);
    var newElement = $(created_element).width(new_width)
        .height(new_height)
        .draggable({
        cancel: "text",
        start: function (){
          $('#18xf56').focus();
        },
        stop: function (){
          $('#18xf56').focus();
        } 
        
        })
     .resizable()
        .css({
        'position'          : 'absolute',
        'z-index'           : '2000000',
        'border'            : 'black'
        })
        .offset(new_offset).appendTo('body');


        $(created_element).click(function(){
            $(editable_text).focus();
        });

        $(save_button).click(function(){
            borderedElement.style.border = "";
           chrome.runtime.sendMessage({command: "send", element_html:elementOnMouseOver.outerHTML, entered_text:$(editable_text).text(), url:window.location["href"]}, 
            function(response) {
                    alert(response.msg +" : "+ response.enteredText + " : "+ window.location["href"]);
            });

            created_element.remove();





        });

        return created_element;

        };


$(document).keydown(function(event) {
    switch(event.which) {
        case 37: // left
      //  alert("Entering Key Left");
        elementOnMouseOver = document.elementFromPoint(x, y);

            if(elementOnMouseOver.style.border == "" && elementOnMouseOver.tagName != "input"){
    			elementOnMouseOver.style.border = "thick solid green";
                var edit_box = create_popup_box($(elementOnMouseOver).offset().top, $(elementOnMouseOver).offset().left+50, elementOnMouseOver);
   			}

                break;

    }

});

function goToNextURL(){
            chrome.runtime.sendMessage({command: "get"}, function(response) {
            //alert(response.task_obj["element_html"]);

            //This sends the user to the next page if the urls do not match
            if(window.location["href"] != response.taskObj["url"]) {
                window.location = response.taskObj["url"];
            }

            
            alert("Searching for element: " + response.taskObj["element_html"]);

            var all_elements = document.getElementsByTagName("*");

            for (var i = 0, element; element = all_elements[i++];) {
                if(element.outerHTML == response.taskObj["element_html"]){
                    alert("Item found: " + response.taskObj["entered_text"]);
                    element.style.border = "thick solid green";
                }
            }

         });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.command== "load"){
        if(student_view_next != "null")
            student_view_next.remove();

    student_view_next = $('<div id = "fjh43jfb">Click me to go next</div>');

    student_view_next.css({
        'height': '40px', 
        'position': 'fixed', 
        'bottom':'5%',
        'right':'5%',
        'width': '70px',
        'background-color': '#393838',
        'opacity': '1'
    });

    student_view_next.appendTo('body');

    student_view_next.click(function(){
        goToNextURL();
    });

      sendResponse("Action completed");
    }
  });


