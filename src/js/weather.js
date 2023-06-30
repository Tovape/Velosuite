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

document.addEventListener("DOMContentLoaded", function(event) {
	weather = document.getElementById("weather");
	weather_icon = document.getElementById("weather-icon");
	weather_temperature = document.getElementById("weather-temperature");
	weather_wind = document.getElementById("weather-wind");
	weather_humidity = document.getElementById("weather-humidity");
	weather_precipitation = document.getElementById("weather-precipitation");
	weather_graph = document.getElementById("weather-graph");
	
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
});

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