var x = 0;
var y = 0;
$(window).mouseover(function(e) {
    x = e.clientX, y = e.clientY;
});

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
            alert("save button clicked!");
            borderedElement.style.border = "";
            created_element.remove();
        });

        return created_element;

        };

        

//     console.log("Created");
//     var div = document.createElement("div");
//     div.style.width = "100px";
//     div.style.height = "100px";
//     div.style.top = top.toString()+"px";
//     div.style.left = left.toString()+"px";
//     div.style.backgroundColor = "blue";
//     div.innerHTML = "";
//     div.style.zIndex = "2000000";
//     div.setAttribute("class", "draggable");
//     div.setAttribute("contenteditable", "true");
//     div.style.position = "absolute";

// //Uncomment for draggability
//     //$(div).draggable();
//     document.body.appendChild(div);

//     var innerTextArea = document.createElement('input');

//     div.appendChild(innerTextArea);



//}

$(document).keydown(function(event) {
    switch(event.which) {
        case 37: // left
      //  alert("Entering Key Left");
        elementOnMouseOver = document.elementFromPoint(x, y);

            if(elementOnMouseOver.style.border == "" && elementOnMouseOver.tagName != "input"){
    			elementOnMouseOver.style.border = "thick solid green";
                
                var edit_box = create_popup_box($(elementOnMouseOver).offset().top, $(elementOnMouseOver).offset().left+50, elementOnMouseOver);



                chrome.runtime.sendMessage({command: "send", element:elementOnMouseOver.outerHTML}, function(response) {

                    
                });
   			}

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