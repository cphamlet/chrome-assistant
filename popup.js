$( document ).ready(function() {

	function callIt(){
		//send data to server
		console.log("CAlled call it");
		$("#main_screen").show();
		$("#login_screen").hide();
		
	}

	$("#login").click(callIt());
//Save record button sends to server
	$("#save_record").click(function(){
		//send data to server
	chrome.runtime.sendMessage({command: "save"}, 
	            function(response) {
	                    console.log(response);
	            });
	});


//Clear button clears list
	$("#clear_record").click(function(){
	//send data to server
	chrome.runtime.sendMessage({command: "clear"}, 
	            function(response) {
	                    console.log(response);
	            });
	});

//Loads the record into the frame
	$("#load_record").click(function(){
	//send data to server
	console.log("entering load record");
		  chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
		     // since only one tab should be active and in the current window at once
		     // the return variable should only have one entry
		     console.log("THE TAB ID: "+ arrayOfTabs[0].id);
		     chrome.tabs.sendMessage(arrayOfTabs[0].id, {command:'load'}, function(response) {
			    console.log('Start action sent');
			});//end send message
		  });//end query

  });//end click




});








