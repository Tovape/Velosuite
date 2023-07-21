// Global Variables
var temp = null;
var popup = null;
var popup_inputs = {};
var popup_gradient = null;
var popup_progressbar_dom = null;
var popup_content_active = null;
var popup_content_dom = null;
var popup_content_pos = 0;
var popup_gradient_icon_dom = null;
var popup_content_icon_arr = ["./files/images/logo/logo-icon.svg", "./files/themes/default/icons/global/language.svg", "./files/themes/default/icons/global/theme.svg", "./files/themes/default/icons/global/user.svg"];

document.addEventListener("DOMContentLoaded", function(event) { 
	popup = document.getElementById("popup")
	popup_content_dom = document.getElementById("popup-content")
	popup_content_active = document.querySelectorAll(".popup-content > div")
	popup_gradient_icon_dom = document.getElementById("popup-gradient-icon")
	popup_gradient = document.getElementById("popup-gradient")
	popup_progressbar_dom = document.getElementById("progress-bar-value")
	popup_inputs = { ...popup_inputs, ...{"username": document.getElementById("username"), "password": document.getElementById("password")} };

	popup_inputs["username"].addEventListener('focus', function () {
		this.classList.add('isEmpty');
	});

	popup_inputs["username"].addEventListener('blur', function () {
		if (!this.value) {
			this.classList.remove('isEmpty');
		}
	});
	
	popup_inputs["password"].addEventListener('focus', function () {
		this.classList.add('isEmpty');
	});

	popup_inputs["password"].addEventListener('blur', function () {
		if (!this.value) {
			this.classList.remove('isEmpty');
		}
	});

	calcHeight(null, true)
	popup_gradient_icon_dom.setAttribute("src", popup_content_icon_arr[0])
});

/* Slides */
function nextSlide(dom) {
	if (dom.getAttribute("pos") == popup_content_icon_arr.length) {
		if (popup_inputs["username"].value == "" || popup_inputs["username"].value == null || popup_inputs["username"].value == undefined) {
			popupMessage(1, "Please enter username first")
		} else {
			popup_content_pos-= 100;
			popup_content_dom.style.left = popup_content_pos + "%";
			popup_gradient_icon_dom.setAttribute("src", popup_content_icon_arr[parseInt(dom.getAttribute("pos"))])
			popup_gradient.style.display = "none";
			beginSetup()
		}
	} else {
		popup_content_pos-= 100;
		popup_content_dom.style.left = popup_content_pos + "%";
		popup_gradient_icon_dom.setAttribute("src", popup_content_icon_arr[parseInt(dom.getAttribute("pos"))])
		calcHeight(dom)
	}
}

function backSlide(dom) {
	if (popup_content_pos != 0) {
		popup_content_pos+= 100;
	}
	popup_content_dom.style.left = popup_content_pos + "%";
	popup_gradient_icon_dom.setAttribute("src", popup_content_icon_arr[parseInt(dom.getAttribute("pos"))])
	calcHeight(dom)
}

/* Height Animation */
function calcHeight(dom, start = false) {
	if (!start) {
		popup.style.height = (parseInt(290) + parseInt(popup_content_active[parseInt(dom.getAttribute("pos"))].offsetHeight)) + "px";
	} else {
		popup.style.height = (parseInt(290) + parseInt(popup_content_active[0].offsetHeight)) + 25 + "px";
	}
}

/* Setup Fetch */
function beginSetup() {
	var query = `
		{
			"username": "${popup_inputs["username"].value}",
			"password": "${popup_inputs["password"].value}"
		}
	`;
	fetch("http://localhost:3000/api/ctrl", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: query
	}).then(response => {
		if (!response.ok) {
			popupMessage(2, "Setup Error")	
		}
		return response.json()
	}).then(data => {
		console.log(data)
		if (data.status == 0) {
			setTimeout(function(){
				popup_progressbar_dom.classList.toggle("end")
				setTimeout(function(){
					location.reload();
				}, 1000);
			}, 2000);
		}
	})	
}
