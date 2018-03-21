$( document ).ready(function() {
    
    
    // BRANDON
		// $("#newRecordingSetup").hide();
		function showNewRecording(){
			//send data to server
			
			chrome.tabs.query({currentWindow: true, active : true}, function() {
              		chrome.browserAction.setPopup({
                  	popup: "hello.html"
           		});
        		});
		}

		$("#startR").on("click", function(){
			showNewRecording();
		});
		$("#submitR").on("click", function(){
			// var tutorialName = $('#formName').val();
			// // console.log($('#formName').val());
			// chrome.runtime.sendMessage({command: "addName", tutorial_name: tutorialName},
			// 	function(response) {
	  //                   console.log(response);
	                    
	  //           });
				$("#endR").prop('disabled', false);
				$(this).prop('disabled', true);
				// window.close();

        		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					  chrome.tabs.sendMessage(tabs[0].id, {command: "hotKey"}, function(response) {
					    console.log(response);
					  });
				});
		});

		$("#endR").on('click', function(){
			$(this).prop('disabled', true);
			chrome.tabs.query({currentWindow: true, active : true}, function() {
              		chrome.browserAction.setPopup({
                  	popup: "popup.html"
           		});
        		});
		});	


	// BRANDON

	function removeLoginScreen(){
		//send data to server
		$("#main_screen").show();
		$("#login_screen").hide();
	}

	$("#login").click(removeLoginScreen());
//Save record button sends to server
	$("#save_record").click(function(){
		//send data to background script
	//Retrieves all of data in popup. 

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

//this is how to send messages to main.js... say chrome.tabs not chrome.runtime.sendMessage
//
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








