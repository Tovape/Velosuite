/* Global Variables */
var temp = null;
var temp2 = null;
var inputs = null;
var theme_selected = null;

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
var weather_graph = null;

/* Notes */
var notes_deposit = null
var notes_each = null;
var notes_filter = null
var notes_delay;
var notes_filter_array = [];

/* Settings */
var settings_nav = null;
var settings_page_each = null;
var settings_page_last = null;
var settings_page_active = "home";

document.addEventListener("DOMContentLoaded", function(event) {
	notes_deposit = document.getElementById("notes-deposit")
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
	weather_graph = document.getElementById("weather-graph");
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
			
			weather_temperature.textContent = (data.daily[0].temp.max).toFixed(1).replace('.0', '') + "°"
			weather_wind.innerHTML = (data.daily[0].wind_speed).toFixed(1).replace('.0', '') + "<span>km/h</span>"
			weather_humidity.innerHTML = (data.daily[0].humidity).toFixed(1).replace('.0', '') + "<span>%</span>"
			weather_precipitation.innerHTML = (data.daily[0].pop).toFixed(1).replace('.0', '') + "<span>%</span>"
			
			temp = today.getHours();

			if (temp >= 21 || temp <= 5) {
				temp2 = data.daily[0].weather[0].icon.substring(0, data.daily[0].weather[0].icon.length - 1);
				weather_icon.setAttribute("src", "../files/themes/default/icons/weather/" + temp2 + "n.svg")
				weather.classList.toggle("night")
			} else if (temp >= 6 || temp < 21) {
				weather_icon.setAttribute("src", "../files/themes/default/icons/weather/" + data.daily[0].weather[0].icon + ".svg")
				weather.classList.toggle("day")
			}
			
			weatherChart(data)
			break;
	}
}

// Start ChartJS
function weatherChart(data) {
	var chartgen = null;
	var tempgen = [];
	var max = 0;
	var min = 0;
	
	temp = document.getElementById("weather-units").getAttribute("value")
		
	if (temp == "celsius") {
		min = -30;
		max = 60;
		chartgen = [-30,-20,-10,0,10,20,30,40,50,60]
	} else if (temp == "fahrenheit") {
		min = -20;
		max = 160;
		chartgen = [-20,0,20,40,60,80,100,120,140,160]
	} else {
		min = -30;
		max = 60;
		chartgen = [-30,-20,-10,0,10,20,30,40,50,60]
	}
	
	for (let i = 0; i < data.daily.length; i++) {
		tempgen.push((data.daily[i].temp.max).toFixed(1))
	}			
	
	new Chart(weather_graph, { type: "line", data: { labels: day_names, datasets: [{ data: tempgen, borderColor: "rgba(255,255,255,1)", backgroundColor: "transparent" }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { tooltip: { enabled: false } }, legend: {display: false}, scales: { xAxes: [{ display: false, scaleLabel: { display: false }, }], yAxes: [{ display: false, ticks: { min: min, max: max } }], }, elements: { point:{ radius: 0 } } } });
}

function timelineChart() {
	
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

// Toggle Page Popup
function togglePagePopup(page) {
	temp = document.querySelector(".page-each.active .overlay."+page)
	temp.classList.toggle("active")
}

// Note Event Listeners
function createNoteEvents() {
	notes_filter = document.querySelectorAll(".page-notes .note-filter .selection-each > input")
	notes_each = document.querySelectorAll(".page-notes .note-each")
	
	// Note Click
	for (var i = 0, j = notes_each.length; i < j; i++) {
		notes_each[i].addEventListener('click', function (e) {
			if (this.classList.contains("lag")) {
				openNote(this.getAttribute("id"))
				console.log(this)
				console.log(2)
			}
		});
	}
	
	// Notes Filter
	for(let i = 0; i < notes_filter.length; i++) {
		notes_filter[i].addEventListener("click", function() {
			temp = notes_filter[i].getAttribute("value")
			for (let j = 0; j < notes_each.length; j++) {
				if (temp == "All") {
					notes_each[j].classList.remove("hide")
				} else if (temp == notes_each[j].getAttribute("category")) {
					notes_each[j].classList.remove("hide")
				} else {
					notes_each[j].classList.add("hide")
				}
			}
		});
	}
	document.querySelector(".page-notes .header-filters .note-filter .selection-each input[value='All']").click()
	
	// Note Hold
	for (var i = 0, j = notes_each.length; i < j; i++) {
		notes_each[i].addEventListener('mousedown', function (e) {
			if (e.target.nodeName != "BUTTON") {
				if (this.classList.contains("active")) {
					this.classList.toggle('active');
					_this = this
					console.log(1)
					setTimeout(function(){
						_this.classList.add('lag');
					}, 300);
					console.log(3)
				} else {
					notes_delay = setTimeout(check, 700);
					_this = this;
					function check() {
						if (!_this.classList.contains("active")) {
							_this.classList.add('active');
							_this.classList.remove('lag');
							console.log(_this)
						}
					}
				}
			}
		}, true);

		notes_each[i].addEventListener('mouseup', function (e) {
			clearTimeout(notes_delay);
		});

		notes_each[i].addEventListener('mouseout', function (e) {
			clearTimeout(notes_delay);
		});
	}
}

// Note Filters Listeners
function createNoteFilters() {
	temp = [...new Set(notes_filter_array)];
	for (let i = 0; i < temp.length; i++) {
		temp2 = document.querySelector(".page-notes .header-filters .note-filter .selection-each").cloneNode(true);
		temp2.querySelector("input").setAttribute("value", temp[i])
		temp2.querySelector("input").setAttribute("id", temp[i])
		temp2.querySelector("label").textContent = temp[i]
		document.querySelector(".page-notes .header-filters .note-filter").insertAdjacentHTML("beforeend", temp2.outerHTML);
	}
}

// Get Notes
function getNotes() {
	fetch("http://localhost:3000/api/note/", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		}
	}).then(response => {
		return response.json()
	}).then(data => {
		if (data.status == 0) {
			for (let i = 0; i < data.notes.length; i++) {
				temp = JSON.parse(data.notes[i][1])
				temp2 = ejs_templates["deleteNote"]
				temp2 = temp2.replace("replace_filename", data.notes[i][0])
				if (temp.category != null) {
					notes_filter_array.push(temp.category)
				}
				notes_deposit.insertAdjacentHTML("beforeend", `
				<div class="note-each" creationDate="` + temp.creationDate + `" modifiedDate="` + temp.modifiedDate + `" category="` + temp.category + `" id="` + data.notes[i][0] + `" style="background-color: ` + temp.backgroundColor + `;">
					<p class="title">` + temp.title + `</p>
					<p class="date">` + temp.modifiedDate + `</p>
					` + temp2 + `
				</div>	
				`)
			}
			createNoteFilters()
			createNoteEvents()
		} else {
			popupMessage(2, data.message)
		}
	})
}

// Open Note
function openNote(id) {
	togglePagePopup("read")
	tinymce.init({
		selector: document.getElementById("hola"),
		plugins: 'a_tinymce_plugin',
		a_plugin_option: true,
		a_configuration_option: 400
	});
}

// New Note
function newNote() {
	temp = document.querySelector(".page-notes input[name='note-title']")
	var query = `
		{
			"title": "` + temp.value + `"
		}
	`;
	fetch("http://localhost:3000/api/note/", {
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
			temp2 = ejs_templates["deleteNote"]
			temp2 = temp2.replace("replace_filename", data.note.filename + ".json")
			notes_deposit.insertAdjacentHTML("beforeend", `
			<div class="note-each" creationDate="` + data.note.creationDate + `" modifiedDate="` + data.note.modifiedDate + `" category="` + data.note.category + `" id="` + data.note.filename + `.json" style="background-color: ` + data.note.backgroundColor + `;">
				<p class="title">` + data.note.title + `</p>
				<p class="date">` + data.note.modifiedDate + `</p>
				` + temp2 + `
			</div>	
			`)
			createNoteEvents()
			setTimeout(function(){
				togglePagePopup('create')
			}, 2000);
		} else {
			popupMessage(2, data.message)
		}
	})
}

// Update Note
function updateNote() {
	var query = `
		{
			"title": "` + title + `"
		}
	`;
	fetch("http://localhost:3000/api/note/", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: query
	}).then(response => {
		if (!response.ok) {
			popupMessage(2, "Note Error")
		}
		return response.json()
	}).then(data => {
		if (data.status == 0) {
			popupMessage(0, data.message)
		}
	})	
}

// Delete Note
function deleteNote(filename) {
	var query = `
		{
			"filename": "` + filename + `"
		}
	`;
	fetch("http://localhost:3000/api/note/", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: query
	}).then(response => {
		if (!response.ok) {
			popupMessage(2, "Note Error")
		}
		return response.json()
	}).then(data => {
		if (data.status == 0) {
			popupMessage(0, data.message)
			document.getElementById(filename).remove()
		}
	})	
}

// Load Page Content
function loadPageContent(page) {
	if (page == "notes") {
		getNotes()
	}
}