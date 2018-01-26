/*
* Author: Connor Hamlet
* Funcitonality: This is the content script for our google chrome extension. 
* This is the script responsible for displaying the save button and the "Next" button.
*/
//x and y of mouse pointer
var x = 0;
var y = 0;
//This element is the element that currently have a border around it when it is selected. 
var unborderedElementPointerHTML = null;
$(window).mouseover(function(e) {
    x = e.clientX, y = e.clientY;
});


var student_view_next = "null";
//This message asks the background if you are in "load mode"<p>Since the index is zero-based, the first list item is returned:</p>

$(document).ready(function() {
    retrieveItemfromBackgroundScript();
});

function retrieveItemfromBackgroundScript(){
      chrome.runtime.sendMessage({command: "get-load-status"}, 
                function(response) {
                    //if false, you are not in "load mode"
                     if(response == false){
                        console.log("Not loaded.");
                     }else{
                        createAdvanceLinkButton();
                        //Message asks background if you are on the correct link
                        chrome.runtime.sendMessage({command: "peek"}, function(response) {
                            //If equal, load the html 
                            if(typeof response.taskObj != 'undefined' && window.location["href"] == response.taskObj["url"]) {
                                //Message asks background for html and moves to next item. 
                                chrome.runtime.sendMessage({command: "shift"}, function(responseShift) {
                                    console.log("shifted:" + JSON.stringify(responseShift.taskObj));
                                    loadHTMLContent(responseShift);
                                }); //end of shift command msg 
                            }//end of null check
                        }); //end peek send msg
                     } //end else
                }); //end first reponse function
    }

//Creates the button for the "next" button 
function create_popup_box(top, left, borderedElement, popup_ID){

var new_offset = {top:top, left:left};
    var new_width = 200;
    var new_height = 50;
    var created_element = $('<div class = "4k3jfn" id ="'+popup_ID+'" ></div>');
    var editable_text = $('<div contenteditable = "true" class ="56sdjfh"></div>');
    var save_button = $('<div class = "ck42jr"></div>');
    var button_text = $('<span class = "34ifun">Save</span>');
    save_button.append(button_text);

    editable_text.css({
        'background-color':'#ededed',
        'height'    : '40px',
        'font-size' : '12px',
        'color'     : 'black',
        'border'    :  'black solid'
    });
    save_button.css({
        'background-color' : '#00826c',
        'color'         : "white",
        'width'         : "75px",
        'height'        :"30px",
        'margin-top'    :"3px"   
    });

    button_text.css({
        'margin': '10px 10px',
        'font-size': '22px'
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


        //When you click on the textbox, give keyboard focus. 
        $(created_element).click(function(){
            $(editable_text).focus();
        });


        //Hanldes the click function for newly created save button
        $(save_button).click(function(){
            //When you click the save button, this reverts the green block of text back to normal. 
              if(unborderedElementPointerHTML!=null) {
                  //This replace with function, removes the element with the green border if one already exists. 
                  $(elementOnMouseOver).replaceWith($(unborderedElementPointerHTML).prop('outerHTML'));
              }
           chrome.runtime.sendMessage({command: "send", element_html:unborderedElementPointerHTML, entered_text:$(editable_text).text(), url:window.location["href"]}, 
            function(response) {
                //    alert(response.msg +" : "+ response.enteredText + " : "+ window.location["href"]);
            });
            created_element.remove();
        });

        return created_element;

};


$(document).keydown(function(event) {
    switch(event.which) {
        case 37: // left
        //This popup id is the unique ID for all of the SAVE button popups. 
                var popup_ID = "4iufbw";
                //If a popup already exists, delete the old one. 
                if(document.body.contains( document.getElementById(popup_ID) )){
                    if(unborderedElementPointerHTML!=null) {
                        //This replace with function, removes the element with the green border if one already exists. 
                        $(elementOnMouseOver).replaceWith($(unborderedElementPointerHTML).prop('outerHTML'));
                    }
                    document.getElementById(popup_ID).remove();
                }
        elementOnMouseOver = document.elementFromPoint(x, y);
        unborderedElementPointerHTML = elementOnMouseOver.outerHTML;
            if(elementOnMouseOver.style.border == "" && elementOnMouseOver.tagName != "input"){
    			elementOnMouseOver.style.border = "thick solid green";

                
                var edit_box = create_popup_box($(elementOnMouseOver).offset().top, $(elementOnMouseOver).offset().left+50, elementOnMouseOver, popup_ID);
   			}
                break;

    }

});

function goToNextURL(){
            chrome.runtime.sendMessage({command: "peek"}, function(response) {

            //This sends the user to the next page if the urls do not match
            if(typeof(response.taskObj) != 'undefined' && window.location["href"] != response.taskObj["url"]) {
                window.location = response.taskObj["url"];
            }else{
                   loadHTMLContent(response);
            }

         });
}

//Displays border on webpage from element stored in background page. 
function loadHTMLContent(responseObj){
            console.log("Searching for element: " + responseObj.taskObj["element_html"]);
            var all_elements = document.getElementsByTagName("*");
            for (var i = 0, element; element = all_elements[i++];) {
                console.log(element.outerHTML);
                if(element.outerHTML == responseObj.taskObj["element_html"]){
                    console.log("Item found: " + responseObj.taskObj["entered_text"]);
                    element.style.border = "thick solid green";
                }
            }

}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.command == "load"){

        if(student_view_next != "null"){
            student_view_next.remove();
            student_view_next = "null";
            sendResponse("Action completed");
            return;
        }

    chrome.runtime.sendMessage({command: "set-load-status"}, 
            function(response) {
                    console.log("Set load status to: "+response);
                 });
    createAdvanceLinkButton();
    sendResponse("Action completed");
    }
});

function createAdvanceLinkButton(){
    if(student_view_next != "null"){
            student_view_next.remove();
    }
    student_view_next = $('<a id = "fjh43jfb" href="#">Next</a>');

    student_view_next.css({
        // 'height': '40px', 
         'position': 'fixed', 
         'bottom':'5%',
         'right':'5%',
         'background-color': '#0078e7',
         'font-size':'14px',
         'font-family':'sans-serif',
         'padding' : '.5em 1em',
         'border':'transparent',
         'border-radius':'2px',
        // 'width': '70px',
        // 'background-color': '#0080ff',
        // 'opacity': '1',
        // 'text-align' : 'center',
         'color'     : 'white'
    });

    student_view_next.appendTo('body');

    student_view_next.click(function(){
        goToNextURL();
    });


}


