// Global Variables
var temp = null;
var page_each = null;
var navigator_each = null;
var page_last = null;
var page_active = "home";
var weather_apiKey = "0c6c7437dc3965467da9bf26b092f8d2";
var weather_lat = null;
var weather_lon = null;
var weather_apiUrl = null;
const month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var clock_time = null;
var clock_day = null;
var clock_month = null;
var today = null;
var hr = null;
var min = null;
var sec = null;

document.addEventListener("DOMContentLoaded", function(event) {
	page_each = document.querySelectorAll(".page-each")
	navigator_each = document.querySelectorAll(".nav-each")
	clock_time = document.getElementById("clock-time");
	clock_day = document.getElementById("clock-day");
	clock_month = document.getElementById("clock-month");
	
	// Time Clock Init
	getTime()
	setInterval(getTime, 59000);
	today = new Date();
	clock_day.textContent = day_names[today.getDay()]
	clock_month.textContent = month_names[today.getMonth()] + " " + today.getDate() + "th"
	
	// Weather Init
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((position) => {
			weather_lat = position.coords.latitude;
			weather_lon = position.coords.longitude;
			weather_apiUrl = "http://api.openweathermap.org/data/2.5/onecall?lat=" + weather_lat + "&lon=" +  weather_lon + "&units=metric&exclude=hourly,minutely,current&lang=en&appid=" + weather_apiKey;
			getWeather(false)
		});
	} else {
		console.log("%c Exeption: Does not have access to weather location", 'color: #FF0000');
	}

	// Pages/Nav Init
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
function themeChange() {
	console.log("%c Info: Changing Theme", 'color: #6D94DB');
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
			popupMessage(2, "Theme Error")	
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

// Weather
function getWeather(update) {
	var mm = today.getMonth() + 1;
	var dd = today.getDate();
	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;
	var timestamp = dd + '/' + mm + '/' + today.getFullYear();
	
	if (update) {
		console.log("%c Info: Deleting Weather", 'color: #6D94DB');
		deleteLocalhost("weather_data")
	}
	if (loadLocalhost("weather_data")) {
		if (timestamp !== loadLocalhost("weather_timestamp")) {
			getWeather(true)
		} else {
			console.log("%c Info: Loading Weather", 'color: #6D94DB');
			parseWeather(JSON.parse(loadLocalhost("weather_data")))
		}
	} else {
		fetch(weather_apiUrl, {
			method: "GET"
		}).then(response => {
			return response.json();
		}).then(data => {
			console.log("%c Info: Updating Weather", 'color: #6D94DB');
			saveLocalhost(data, "weather_data", "weather")
			saveLocalhost(timestamp, "weather_timestamp", "string")
			parseWeather(data)
		})
	}
}

function parseWeather(data) {console.log(data)}

// Time Clock
function getTime(){
	today = new Date();
	hr = today.getHours();
	min = today.getMinutes();

	if(hr < 10){
		hr = "0" + hr;
	}
	if(min < 10){
		min = "0" + min;
	}

	clock_time.textContent = hr + ":" + min;
}