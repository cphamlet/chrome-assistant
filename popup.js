$( document ).ready(function() {

	function removeLoginScreen(){
		//send data to server
		$("#main_screen").show();
		$("#login_screen").hide();
	}

	$("#login").click(removeLoginScreen());
//Save record button sends to server
	$("#save_record").click(function(){
		//send data to background script
		console.log("saving");
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
	console.log("Entering load record function");
		  chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
		     // since only one tab should be active and in the current window at once
		     // the return variable should only have one entry
		     chrome.tabs.sendMessage(arrayOfTabs[0].id, {command:'load'}, function(response) {
			    console.log('Start action sent');
			});//end send message
		  });//end query

  });//end click




});








