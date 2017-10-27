function callIt(){
	//send data to server
	$("#login_screen").hide();
	$("#main_screen").show();
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("login").addEventListener("click", callIt);
});


