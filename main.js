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
                            //If urls match, load the html 
                            var tutorial = response.tutorial;

                            if(window.location["href"] == get_current_step(tutorial).url) {
                                //Message asks background for html and moves to next item. 
                                //TODO: Present the user with choice instead of going with 0th edge 
                                chrome.runtime.sendMessage({command: "get_next", next_id:tutorial.nodes[tutorial.current_id].edges[0]}, function(responseShift) {
                                    if(responseShift==null){
                                        alert("Out of steps!");
                                    }
                                    loadHTMLContent(responseShift);
                                }); //end of shift command msg 
                            }//end of null check
                        }); //end peek send msg
                     } //end else
                }); //end first reponse function
    }

//Creates the button for the "save" button 
function create_popup_box(top, left, borderedElement, popup_ID){

    var new_offset = {top:top, left:left};
    //Title text is the title input box above the main text box
    var title_text = $('<input type="text" placeholder="Title" class ="editable"></input>');
    var created_element = $('<div class = "" id ="'+popup_ID+'" ></div>');
    //Editable is the main description text box
    var editable_text = $('<div contenteditable = "true" placeholder="Description" class ="editable"></div>');
    var save_button = $('<div class = ""></div>');
    var button_text = $('<p class = "">Save</p>');
    save_button.append(button_text);
    //TODO: Remove pixel specifications and go with a relative unit (e.g. percent, em)
    created_element.css({
        'background-color':'rgba(0,0,0,0.6)',
        'padding'         : '15px',
        'border-radius'   : '10px',
        'width'           : '200px'
    });
    editable_text.css({
        'background-color':'#ededed',
        'height'    : 'auto',
        'min-height': '35px',
        'font-size' : '12px',
        'color'     : 'black',
        'border'    : 'black solid',
        'padding'   : '4px',
        'border-radius':'8px'
    });
    title_text.css({
        'background-color':'#ededed',
        'height'    : '14x',
        'width'     :'188px',
        'max-height': '20px',
        'font-size' : '16px',
        'color'     : 'black',
        'border'    :  'black solid',
        'margin-bottom': '0.4em',
        'padding'   :   '4px',
        'border-radius': '8px'
    })

    //This function sets the save_button in the student view's css
    var set_save_button_css_default = function(save_button){
        save_button.css({
            'background-color' : 'rgb(18, 226, 169)',
            'border-radius' : '1.4em',
            'color'         : "white",
            'width'         : "75px",
            'height'        :"30px",
            'margin-top'    :"3px"   
        });  
    }  
    set_save_button_css_default(save_button);

    //Hover functionality. 
    save_button.hover(function(){
        save_button.css({
            'background-color' : 'rgb(18, 175, 114)',
            'border-radius' : '1.4em',
            'color'         : "white",
            'width'         : "75px",
            'height'        :"30px",
            'margin-top'    :"3px"   
        });  
        }, function(){set_save_button_css_default(save_button);}
    );

    button_text.css({
        'line-height': '28px',
        'font-size': '18px',
        'text-align': 'center'
    });
    //This combines all the elements under a unified div
    created_element.append(title_text);
    created_element.append(editable_text);
    created_element.append(save_button);

    $(created_element).draggable({
        // //start: function(){}
        stop: function (){
            console.log("trident");
           //If when you stop dragging, the title isn't full give focus
            if($(title_text).val().length == 0){
                $(title_text).focus();
            }else{
                $(editable_text).focus();
            }
        } 
       
        });
    //Don't let the user drag when either text box is in focus
    $(title_text).add(editable_text).focusin(function(){
        console.log("enter");
        $(created_element).draggable({
             cancel: ".editable"
             });

    });
    $(title_text).add(editable_text).focusout(function(){
        $(created_element).draggable({
             cancel: ""
        });

    });

    //Append the created element to the body
    $(created_element)
     .resizable()
        .css({
        'position'          : 'absolute',
        'z-index'           : '2000000',
        'border'            : 'black'
        })
        .offset(new_offset).appendTo('body');


        //When you click on the textbox, give keyboard focus. 
        $(editable_text).click(function(){
            $(editable_text).focus();
        });
        //When you click on the textbox, give keyboard focus. 
        $(title_text).click(function(){
            $(title_text).focus();
        });


        //Hanldes the click function for newly created save button
        $(save_button).click(function(){
            //When you click the save button, this reverts the green block of text back to normal. 
              if(unborderedElementPointerHTML!=null) {
                  //This replace with function, removes the element with the green border if one already exists. 
                  $(elementOnMouseOver).replaceWith($(unborderedElementPointerHTML).prop('outerHTML'));
              }
           chrome.runtime.sendMessage({command: "record_action", element_html:unborderedElementPointerHTML, entered_text:$(editable_text).text(), url:window.location["href"]}, 
            function(response) {
                //    alert(response.msg +" : "+ response.enteredText + " : "+ window.location["href"]);
            });
            created_element.remove();
        });

        return created_element;

};


$(document).keydown(function(event) {

        if(event.keyCode == 81 && event.ctrlKey){ // Ctrl + Q
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
        }

});

function goToNextURL(){
            chrome.runtime.sendMessage({command: "peek"}, function(response) {
            console.log(response.tutorial);
            console.log(get_current_step(response.tutorial));
            //This sends the user to the next page if the urls do not match
            if(typeof(response.tutorial) != 'undefined' && window.location["href"] != get_current_step(response.tutorial).url) {
                window.location = get_current_step(response.tutorial).url;
            }else{
                   loadHTMLContent(response);
            }

         });
}

//Displays border on webpage from element stored in background page. 
function loadHTMLContent(responseObj){
            console.log(JSON.stringify(responseObj.tutorial));
            let instructor_text = $('<p id = "sdajck3" href="#">Text box</p>');
            instructor_text[0].innerHTML = get_current_step(responseObj.tutorial).caption;
            instructor_text.css({
                 'position': 'fixed', 
                 'bottom':'5%',
                 'left':'5%',
                 'background-color': '#e60505',
                 'font-size':'12px',
                 'font-family':'sans-serif',
                 'padding' : '.5em 1em',
                 'border':'transparent',
                 'border-radius':'2px',
                 'color'     : 'white'
            });
        
            instructor_text.appendTo('body');

            //console.log("Searching for element: " 
            var all_elements = document.getElementsByTagName("*");
            for (var i = 0, element; element = all_elements[i++];) {
                if(element.outerHTML == get_current_step(responseObj.tutorial).element_html){
                    element.style.border = "thick solid green";
                }
            }

}

//This listens to the popup script 
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.command == "load"){

        if(student_view_next != "null"){
            student_view_next.remove();
            student_view_next = "null";
            sendResponse("Action completed");
        }

    chrome.runtime.sendMessage({command: "set-load-status"}, 
            function(response) {
                    console.log("Setting load status to: " + response);
                 });
    createAdvanceLinkButton();
    sendResponse("Action completed");
    }
});

function createAdvanceLinkButton(){
    //Removes the next button if it already exists
    if(student_view_next != "null"){
            student_view_next.remove();
    }
    student_view_next = $('<a id = "fjh43jfb" href="#">Next</a>');

    student_view_next.css({
         'position': 'fixed', 
         'bottom':'5%',
         'right':'5%',
         'background-color': '#0078e7',
         'font-size':'14px',
         'font-family':'sans-serif',
         'padding' : '.5em 1em',
         'border':'transparent',
         'border-radius':'2px',
         'color'     : 'white'
    });

    student_view_next.appendTo('body');

    student_view_next.click(function(){
        goToNextURL();
    });


}

/*
* Functions for accessing members of the tutorial object.
*/
function get_current_step(tutorialDAG){
    return tutorialDAG.nodes[tutorialDAG.current_id];
}
// //Returns a url object. Url objects have the url, and their step array
// function get_current_url_obj(tutorialObj) {
//     return tutorialObj.urls[tutorialObj.current_url_num];
// }

// //Returns a step obj. Step objs hold the sequence of captions
// // and selected elements on a given page
// function get_current_step_obj(tutorialObj){
//     return tutorialObj.urls[tutorialObj.current_url_num].steps[tutorialObj.current_step_num];
// }
// //Returns the text url of the current step
// function get_current_url(tutorialObj){
//     return get_current_url_obj().url;
// }
