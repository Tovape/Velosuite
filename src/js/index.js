// Global Variables
var temp = null;
var page_each = null;
var navigator_each = null;
var page_last = null;
var page_active = "home";

document.addEventListener("DOMContentLoaded", function(event) {
	page_each = document.querySelectorAll(".page-each")
	navigator_each = document.querySelectorAll(".nav-each")

	if (!((page_each.length + 1) == navigator_each.length)) {
		console.log("%c Exeption: The number of pages/nav options doesn't equal", 'color: #FF0000');
	}
	
	for(let i = 0; i < navigator_each.length; i++) {
		navigator_each[i].addEventListener("click", function() {
			page_last = page_active
			temp = navigator_each[i].getAttribute("value")
			if (!(page_active == temp)) {
				page_active = temp
				togglePage(temp, true)
			}
		});
	}
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
function themefun() {
	var query = `
		{
			"theme": "default"
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
		if (!response.ok) {
			popupMessage(2, "Setup Error")	
		}
		return response.json()
	}).then(data => {
		console.log(data)
		if (data.status == 0) {
			setTimeout(function(){
				location.reload();
			}, 1000);
		}
	})		
	
}