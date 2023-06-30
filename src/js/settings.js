/* Settings */
var settings_nav = null;
var settings_page_each = null;
var settings_page_last = null;
var settings_page_active = "home";

document.addEventListener("DOMContentLoaded", function(event) {
	settings_nav = document.querySelectorAll(".page-settings .page-nav > p")
	settings_page_each = document.querySelectorAll(".page-settings .page-content-each")

	// Settings Page
	for(let i = 0; i < settings_nav.length; i++) {
		settings_nav[i].addEventListener("click", function() {
			settings_page_last = settings_page_active
			temp = settings_nav[i].getAttribute("value")
			if (!(settings_page_active == temp)) {
				settings_page_active = temp
				document.querySelector(".page-settings .page-nav > p.active").classList.remove("active")
				document.querySelector(".page-settings .page-nav > p[value='" + temp + "']").classList.add("active")
				
				document.querySelector(".page-settings .page-content .page-content-each.active").classList.remove("active")
				document.querySelector(".page-settings .page-content .page-content-each[value='" + temp + "']").classList.add("active")
				
				temp = settings_nav[i].getAttribute("pos")
				document.querySelector(".page-settings .page-nav").style.setProperty("--top", (parseInt(temp) * (56)) + "px")
			}
		});
	}
});