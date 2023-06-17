// Global Variables
var popup_message_dom = null;
var popup_color_dom = null;
var popup_text_dom = null;

document.addEventListener("DOMContentLoaded", function(event) {
	console.log('%c Velosuite', 'color: #6D94DB');
	
	popup_message_dom = document.getElementById("popup-message")
	popup_color_dom = document.getElementById("popup-color")
	popup_text_dom = document.getElementById("popup-text")
});

// Popup Message
function popupMessage(context, message) {
	popup_message_dom.classList.toggle("popup-animation")
	popup_text_dom.textContent = message
	
	switch (context) {
		case 0:
			popup_color_dom.style.backgroundColor = "#3bcd20"
			break;
		case 1:
			popup_color_dom.style.backgroundColor = "#ffe31a"
			break;
		case 2:
			popup_color_dom.style.backgroundColor = "#db2727"
			break;
		case 3:
			popup_color_dom.style.backgroundColor = "var(--blue-1)"
			break;
		default:
			popup_color_dom.style.backgroundColor = "var(--blue-1)"
	}
	
	setTimeout(function(){
		popup_message_dom.classList.toggle("popup-animation")
	}, 3000);
}