// Global Variables

var temp = null;

/* Page Navigation */

var page_each = null;
var navigator_each = null;
var page_last = null;
var page_active = "home";

/* Clock */

const month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var clock_time = null;
var clock_day = null;
var clock_month = null;
var today = null;
var hr = null;
var min = null;

/* Weather */

var weather_apiKey = "0c6c7437dc3965467da9bf26b092f8d2";
var weather_lat = null;
var weather_lon = null;
var weather_apiUrl = null;
var weather = null;
var weather_icon = null;
var weather_temperature = null;
var weather_wind = null;
var	weather_humidity = null;
var weather_precipitation = null;

/* Settings */

var settings_nav = null;
var settings_page_each = null;
var settings_page_last = null;
var settings_page_active = "home";

document.addEventListener("DOMContentLoaded", function(event) {
	settings_nav = document.querySelectorAll(".page-settings .page-nav > p")
	settings_page_each = document.querySelectorAll(".page-settings .page-content-each")
	page_each = document.querySelectorAll(".page-each")
	navigator_each = document.querySelectorAll(".nav-each")
	clock_time = document.getElementById("clock-time");
	clock_day = document.getElementById("clock-day");
	clock_month = document.getElementById("clock-month");
	weather = document.getElementById("weather");
	weather_icon = document.getElementById("weather-icon");
	weather_temperature = document.getElementById("weather-temperature");
	weather_wind = document.getElementById("weather-wind");
	weather_humidity = document.getElementById("weather-humidity");
	weather_precipitation = document.getElementById("weather-precipitation");
	
	// Time Clock Init
	getTime()
	setInterval(getTime, 59000);
	today = new Date();
	clock_day.textContent = day_names[today.getDay()]
	clock_month.textContent = month_names[today.getMonth()] + " " + today.getDate() + "th"
	
	// Weather Init
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((position) => {
			temp = document.getElementById("weather-units").getAttribute("value")
			if (temp == "celsius") {
				temp = "metric"
			} else if (temp == "fahrenheit") {
				temp = "imperial"
			} else {
				temp = "metric"
			}
		
			weather_lat = position.coords.latitude;
			weather_lon = position.coords.longitude;
			weather_apiUrl = "http://api.openweathermap.org/data/2.5/onecall?lat=" + weather_lat + "&lon=" +  weather_lon + "&units=" + temp + "&exclude=hourly,minutely,current&lang=en&appid=" + weather_apiKey;
			getWeather(false)
		});
	} else {
		console.log("%c Exeption: Does not have access to weather location", 'color: #FF0000');
	}
	
	temp = today.getHours();

	if (temp >= 21 || temp <= 5) {
		weather.classList.toggle("night")
	} else if (temp >= 6 || temp < 21) {
		weather.classList.toggle("day")
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
				loadPageContent(temp)
				togglePage(temp)
			} else {
				page_active = "home"
				page_last = temp
				togglePage("home")
			}
		});
	}
	
	// Notes Page
	
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
		if (!response.ok) {
			popupMessage(2, "Theme Error")
		}
		return response.json()
	}).then(data => {
		popupMessage(0, "Theme Changed")
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

function parseWeather(data) {
	switch(data.code) {
		case 400:
			console.log("%c Exeption: Weather Bad Request", 'color: #FF0000');
			break;
		case 401:
			console.log("%c Exeption: Weather Unauthorized", 'color: #FF0000');
			break;
		case 404:
			console.log("%c Exeption: Weather Not Found", 'color: #FF0000');
			break;
		case 429:
			console.log("%c Exeption: Weather Too Many Requests", 'color: #FF0000');
			break;
		case 500:
			console.log("%c Exeption: Weather Internal Error", 'color: #FF0000');
			break;
		default:
			weather_icon.setAttribute("src", "../files/themes/default/icons/weather/" + data.daily[0].weather[0].icon + ".svg")
			weather_temperature.textContent = (data.daily[0].temp.max).toFixed(1).replace('.0', '') + "°"
			weather_wind.innerHTML = (data.daily[0].wind_speed).toFixed(1).replace('.0', '') + "<span>km/h</span>"
			weather_humidity.innerHTML = (data.daily[0].humidity).toFixed(1).replace('.0', '') + "<span>%</span>"
			weather_precipitation.innerHTML = (data.daily[0].pop).toFixed(1).replace('.0', '') + "<span>%</span>"
			break;
	}
}

// Change Weather Fetch
function weatherChange() {
	var weather = document.querySelector(".selection input[name=weather-active]:checked").value
	console.log("%c Info: Changing Weather", 'color: #6D94DB');
	var query = `
		{
			"units": "` + weather + `"
		}
	`;
	fetch("http://localhost:3000/api/ctrl/changeWeather", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: query
	}).then(response => {
		if (!response.ok) {
			popupMessage(2, "Weather Error")
		}
		return response.json()
	}).then(data => {
		popupMessage(0, "Weather Changed")
		if (data.status == 0) {
			deleteLocalhost("weather_data")
			deleteLocalhost("weather_timestamp")
			setTimeout(function(){
				location.reload();
			}, 1000);
		}
	})
}

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

// Load Page Content
function loadPageContent(page) {
	
	setTimeout(function(){
		console.log("SQU STOP")
	}, 1000);
}

// New Note
function newNote() {
	
}