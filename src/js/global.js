// Global Variables
var temp1 = null;
var temp2 = null;
var temp3 = null;
var theme = null;
var popup_message_dom = null;
var popup_color_dom = null;
var popup_text_dom = null;

document.addEventListener("DOMContentLoaded", function(event) {
	console.log('%c Velosuite', 'color: #FFFFFF');
	
	theme = document.getElementById("theme-selected").getAttribute("value")
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

// Delete Localhost Storage
function deleteLocalhost(name) {
	if (localStorage.getItem(name)) {
		return localStorage.removeItem(name)
	} else {
		return false;
	}	
}

// Save Localhost Storage
function saveLocalhost(data, name, type) {
	switch(type) {
		case "image":
			localStorage.setItem(name, getBase64Image(data));
			break;
		case "weather":
			localStorage.setItem(name, JSON.stringify(data));
			break;
		case "string":
			localStorage.setItem(name, data);
			break;
		default:
			return false;
	}
}

// Load Localhost Storage
function loadLocalhost(name) {
	if (localStorage.getItem(name)) {
		return localStorage.getItem(name)
	} else {
		return false;
	}
}

// Clone Replace
function replaceSelf(node) {
	const clone = node.cloneNode(true);
	node.replaceWith(clone);

	return clone;
}

// Regex Check
function checkRegex(input) {
	if (input.includes("/")) { return false; }
	if (input.includes("'")) { return false; }
	if (input.includes("\"")) { return false; }
	if (input.includes("/")) { return false; }
	return true;
}

// Detect Image Dark/Light
function getImageBrightness(image, dom) {
	if (image !== null) {
		var img = document.createElement("img");
		img.src = image.getAttribute("src")

		var colorSum = 0;
		
		var canvas = document.createElement("canvas");
		canvas.width = 210;
		canvas.height = 210;

		var ctx = canvas.getContext("2d");
		ctx.drawImage(image,0,0);

		var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
		var data = imageData.data;
		var r,g,b,avg;

		  for(var x = 0, len = data.length; x < len; x+=4) {
			r = data[x];
			g = data[x+1];
			b = data[x+2];

			avg = Math.floor((r+g+b)/3);
			colorSum += avg;
		}

		var brightness = Math.floor(colorSum / (image.width*image.height));

		if(brightness < 127.5){
			dom.classList.add("dark")
		}
	}
}
