/* Global Variables */
var inputs = null;
var theme_selected = null;

/* Page Navigation */
var page_each = null;
var navigator_each = null;
var page_last = null;
var page_active = "home";

document.addEventListener("DOMContentLoaded", function(event) {
	page_each = document.querySelectorAll(".page-each")
	navigator_each = document.querySelectorAll(".nav-each")

	inputs = document.querySelectorAll(".input > input")
	theme_selected = document.getElementById("theme-selected").getAttribute("value");
	
	// Input Listener
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('focus', function () {
			this.classList.add('isEmpty');
		});

		inputs[i].addEventListener('blur', function () {
			if (!this.value) {
				this.classList.remove('isEmpty');
			}
		});
	}

	// Pages/Nav Init
	if (!((page_each.length + 1) == navigator_each.length)) {
		console.log("%c Exeption: The number of pages/nav options doesn't equal", 'color: #FF0000');
	}
	
	for(let i = 0; i < navigator_each.length; i++) {
		navigator_each[i].addEventListener("click", function() {
			page_last = page_active
			temp1 = navigator_each[i].getAttribute("value")
			if (!(page_active == temp1)) {
				page_active = temp1
				togglePage(temp1)
			} else {
				page_active = "home"
				page_last = temp1
				togglePage("home")
			}
		});
	}
	
	// Load data
	getNotes()
});

// Toggle Page
function togglePage(page) {
	if (page_last != "home") {
		document.querySelector(".page-each[value='" + page_last + "']").classList.toggle("index")
	}
	
	if (page != "home") {
		document.querySelector(".page-each[value='" + page + "']").classList.toggle("active")
		document.querySelector(".page-each[value='" + page + "']").classList.toggle("index")
	}
	
	setTimeout(function(){
		if (page_last != "home") {
			document.querySelector(".page-each[value='" + page_last + "']").classList.toggle("active")
		}
	}, 250);
	
	document.querySelector(".nav-each.active").classList.remove("active")
	document.querySelector(".nav-each[value='" + page + "']").classList.add("active")
}

// Change Theme Fetch
function themeChange() {
	var theme = document.querySelector(".selection input[name=theme-active]:checked").value
	console.log("%c Info: Changing Theme", 'color: #6D94DB');
	var query = `
		{
			"theme": "` + theme + `"
		}
	`;
	fetch("http://localhost:3000/api/ctrl/changeTheme", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: query
	}).then(response => {
		return response.json()
	}).then(data => {
		if (data.status == 0) {
			popupMessage(0, "Theme Changed")
			setTimeout(function(){
				location.reload();
			}, 1000);
		} else {
			popupMessage(2, data.message)
		}
	})
}

// Change Clock Fetch
function clockChange() {
	var style = document.querySelector(".selection input[name=clock-active]:checked").value
	console.log("%c Info: Changing Clock", 'color: #6D94DB');
	var query = `
		{
			"style": "` + style + `"
		}
	`;
	fetch("http://localhost:3000/api/ctrl/changeClock", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: query
	}).then(response => {
		return response.json()
	}).then(data => {
		if (data.status == 0) {
			popupMessage(0, data.message)
			setTimeout(function(){
				location.reload();
			}, 1000);
		} else {
			popupMessage(2, data.message)
		}
	})
}

// Change Account Fetch
function accountChange() {
	var username = document.querySelector("input[name=general-username]").value
	var password = document.querySelector("input[name=general-password]").value
	console.log("%c Info: Changing Account", 'color: #6D94DB');
	var query = `
		{
			"username": "` + username + `",
			"password": "` + password + `"
		}
	`;
	fetch("http://localhost:3000/api/ctrl/changeAccount", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: query
	}).then(response => {
		return response.json()
	}).then(data => {
		if (data.status == 0) {
			popupMessage(0, data.message)
			setTimeout(function(){
				location.reload();
			}, 1000);
		} else {
			popupMessage(2, data.message)
		}
	})
}

// Toggle Page Popup
function togglePagePopup(page) {
	temp1 = document.querySelector(".page-each.active .overlay." + page)
	temp1.classList.toggle("active")
}