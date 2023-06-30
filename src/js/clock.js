/* Clock */
const month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var clock_time = null;
var clock_day = null;
var clock_month = null;
var today = null;
var hr = null;
var min = null;

document.addEventListener("DOMContentLoaded", function(event) {
	clock_time = document.getElementById("clock-time");
	clock_day = document.getElementById("clock-day");
	clock_month = document.getElementById("clock-month");

	// Time Clock Init
	getTime()
	setInterval(getTime, 59000);
	today = new Date();
	clock_day.textContent = day_names[today.getDay()]
	clock_month.textContent = month_names[today.getMonth()] + " " + today.getDate() + "th"
});

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
