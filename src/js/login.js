var login_username = null;
var login_password = null;

document.addEventListener("DOMContentLoaded", function(event) {
	login_username = document.getElementById("login-username")
	login_password = document.getElementById("login-password")
});

function login() {
	var username = login_username.value;
	var password = login_password.value;

	const query = `
		{
			"username": "${username}",
			"password": "${password}"
		}
	`;
		
	fetch("http://localhost:3000/api/auth/signin", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: query
	}).then(response => {
		return response.json();
	}).then(data => {
		if (data.status == 0) {
			setCookie('token',JSON.stringify(data),7);
			localStorage.setItem("username", username)
			popupMessage(0, data.message)
			setTimeout(function(){
				location.reload();
			}, 1000);
		} else {
			popupMessage(2, data.message)
		}
	}).catch((err) => {
		popupMessage(2, data.message)
	});
}
