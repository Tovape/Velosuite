// Global Variables
var temp = null;
var popup = null;
var popup_inputs = {};
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
	popup_inputs = { ...popup_inputs, ...{"username": document.getElementById("username")} };

    popup_inputs["username"].addEventListener('focus', function () {
        this.classList.add('isEmpty');
    });

    popup_inputs["username"].addEventListener('blur', function () {
        if (!this.value) {
            this.classList.remove('isEmpty');
        }
    });

	calcHeight(null, true)
});

function nextSlide(dom) {
	popup_content_pos-= 100;
	popup_content_dom.style.left = popup_content_pos + "%";
	popup_gradient_icon_dom.setAttribute("src", popup_content_icon_arr[dom.getAttribute("pos")])
	calcHeight(dom)
}

function backSlide(dom) {
	if (popup_content_pos != 0) {
		popup_content_pos+= 100;
	}
	popup_content_dom.style.left = popup_content_pos + "%";
	popup_gradient_icon_dom.setAttribute("src", popup_content_icon_arr[dom.getAttribute("pos")])
	calcHeight(dom)
}

function calcHeight(dom, start = false) {
	if (!start) {
		popup.style.height = (parseInt(260) + parseInt(popup_content_active[parseInt(dom.getAttribute("pos"))].offsetHeight)) + "px";
	} else {
		popup.style.height = (parseInt(260) + parseInt(popup_content_active[0].offsetHeight)) + "px";
	}
}

