/* Notes */
var notes_deposit = null
var notes_each = null;
var notes_filter = null
var notes_delay;
var notes_filter_array = [];
var notes_interval = null;
var notes_opened = null;
var notes_image = null;
var notes_image_placeholder = null;
var notes_content = [{
	"filename": null,
	"title": null,
	"category": null,
	"content": null,
	"backgroundImage": null,
	"backgroundColor": null
}];

document.addEventListener("DOMContentLoaded", function(event) {
	notes_deposit = document.getElementById("notes-deposit")
	notes_image = document.getElementById("note-image-image-value")
	notes_image_placeholder = document.getElementById("note-image-image-placeholder")

	tinymce.init({
		selector: "#tinymce-note"
	});
	
	notes_image.addEventListener("change", function (e) {
		const inputTarget = e.target;
		const file = inputTarget.files[0];

		if (file) {
			const reader = new FileReader();

			reader.addEventListener("load", function (e) {
				const readerTarget = e.target;
				notes_image_placeholder.setAttribute("src", readerTarget.result)
				notes_image_placeholder.classList.add("active")
			});

			reader.readAsDataURL(file);
		}
	});
});

// Close Note Color/Image selector
function closeColorSelector() {
	document.querySelector(".page-notes .imagecolor > input:checked").checked = false;
}

// Remove Note Color/Image selector
function deleteImageSelector() {
	notes_image_placeholder.classList.remove("active")
	setTimeout(function(){
		notes_image_placeholder.setAttribute("src", "")
	}, 250);
	document.querySelector(".page-notes #note-image-image-value").value = null;
}

// Note Event Listeners
function createNoteEvents() {
	notes_filter = document.querySelectorAll(".page-notes .note-filter .selection-each > input")
	notes_each = document.querySelectorAll(".page-notes .note-each")
	
	// Note Click
	for (var i = 0; i < notes_each.length; i++) {
		notes_each[i].addEventListener('click', function (e) {
			if (this.classList.contains("lag")) {
				openNote(this.getAttribute("id"))
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
					setTimeout(function(){
						_this.classList.add('lag');
					}, 300);
				} else {
					notes_delay = setTimeout(check, 700);
					_this = this;
					function check() {
						if (!_this.classList.contains("active")) {
							_this.classList.add('active');
							_this.classList.remove('lag');
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
	
	// Title Listeners
	document.getElementById('note-current-title').addEventListener("change", function (e) {
		document.getElementById('note-current-title').setAttribute("value", document.getElementById('note-current-title').value)
	});

	// Category Listeners
	document.getElementById('note-category').addEventListener("change", function (e) {
		document.getElementById('note-category').setAttribute("value", document.getElementById('note-category').value)
	});
}

// Note Filters Listeners
function createNoteFilters() {
	temp = [...new Set(notes_filter_array)];
	for (let i = 0; i < temp.length; i++) {
		if (temp[i] != "" && temp[i] != undefined && temp[i] != null) {
			temp2 = document.querySelector(".page-notes .header-filters .note-filter .selection-each").cloneNode(true);
			temp2.querySelector("input").setAttribute("value", temp[i])
			temp2.querySelector("input").setAttribute("id", temp[i])
			temp2.querySelector("label").textContent = temp[i]
			document.querySelector(".page-notes .header-filters .note-filter").insertAdjacentHTML("beforeend", temp2.outerHTML);
		}
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
				<div class="note-each lag" creationDate="` + temp.creationDate + `" modifiedDate="` + temp.modifiedDate + `" category="` + temp.category + `" id="` + data.notes[i][0] + `" style="background-color: ` + temp.backgroundColor + `;">
					<img class="backgroundImage" onerror="this.style.display='none'" src="` + temp.backgroundImage + `">
					<p class="title">` + temp.title + `</p>
					<p class="date">` + temp.modifiedDate + `</p>
					` + temp2 + `
				</div>	
				`)
				notes_content.push({
					"filename": data.notes[i][0],
					"title": temp.title,
					"category": temp.category,
					"content": temp.content,
					"backgroundImage": temp.backgroundImage,
					"backgroundColor": temp.backgroundColor
				})
			}
			createNoteFilters()
			createNoteEvents()
		} else {
			popupMessage(2, data.message)
		}
	})
}

// Open Note
function openNote(filename) {
	togglePagePopup("read")
	noteBeginInterval(filename)

	var result = notes_content.filter(obj => {
		return obj.filename === filename
	})
		
	tinymce.get("tinymce-note").setContent(result[0].content)

	notes_opened = result[0].filename
	document.getElementById('note-current-title').setAttribute("value", result[0].title)
	document.getElementById("note-category").setAttribute("value", result[0].category)
	document.getElementById('note-current-title').value = result[0].title
	document.getElementById("note-category").value = result[0].category
	document.getElementById("note-category").classList.add("isEmpty")
	document.getElementById("note-image-color-value").value = result[0].backgroundColor
	notes_image_placeholder.setAttribute("src", result[0].backgroundImage)

	document.getElementById('note-current-title').addEventListener('input', function() {
		this.style.width = (this.value.length + 3) + 'ch'
	})
	document.getElementById('note-current-title').style.width = (document.getElementById('note-current-title').value.length + 3) + 'ch'
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
			if (temp.category != null) {
				notes_filter_array.push(temp.category)
			}
			notes_deposit.insertAdjacentHTML("beforeend", `
			<div class="note-each lag" creationDate="` + data.note.creationDate + `" modifiedDate="` + data.note.modifiedDate + `" category="` + data.note.category + `" id="` + data.note.filename + `.json" style="background-color: ` + data.note.backgroundColor + `;">
				<img class="backgroundImage" onerror="this.style.display='none'" src="">
				<p class="title">` + data.note.title + `</p>
				<p class="date">` + data.note.modifiedDate + `</p>
				` + temp2 + `
			</div>	
			`)
			notes_content.push({
				"filename": data.note.filename + ".json",
				"title": data.note.title,
				"category": "",
				"content": "",
				"backgroundImage": "",
				"backgroundColor": data.note.backgroundColor
			})
			createNoteFilters()
			createNoteEvents()
		} else {
			popupMessage(2, data.message)
		}
	})
}

// Update Note
async function updateNote(callout) {
	console.log('%c Updating Notes', 'color: #6D94DB');

	var query = `
	{
		"filename": "` + notes_opened + `",
		"title": "` + document.getElementById("note-current-title").value + `",
		"category": "` + document.getElementById("note-category").value + `",
		"content": ` + JSON.stringify(tinymce.get("tinymce-note").getContent()) + `,
		"backgroundColor": "` + document.getElementById("note-image-color-value").value + `",
		"backgroundImage": ` + JSON.stringify(notes_image_placeholder.getAttribute("src")) + `
	}
	`;	

	document.getElementById('note-category').setAttribute("value", document.getElementById('note-category').value)
	document.getElementById('note-current-title').setAttribute("value", document.getElementById('note-current-title').value)

	var result = notes_content.filter(obj => {
		return obj.filename === notes_opened
	})

	result[0]["title"] = document.getElementById("note-current-title").value
	result[0]["category"] = document.getElementById("note-category").value
	result[0]["content"] = tinymce.get("tinymce-note").getContent()
	result[0]["backgroundImage"] = notes_image_placeholder.getAttribute("src")
	result[0]["backgroundColor"] = document.getElementById("note-image-color-value").value
	
	await fetch("http://localhost:3000/api/note/", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: query
	}).then(response => {
		return response.json()
	}).then(data => {
		if (data.status == 1) {
			popupMessage(1, data.message)
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
			notes_filter_array = []
			createNoteFilters()
		}
	})	
}

// Note Save Interval
function noteBeginInterval(filename) {
	notes_interval = setInterval(updateNote, 5000);
}

function noteEndInterval() {
	updateNote()
	clearInterval(notes_interval);
	notes_opened = null;
	document.getElementById('note-title').removeEventListener("input", function() {});
	document.getElementById('note-current-title').removeEventListener("input", function() {});
	document.getElementById('note-category').removeEventListener("input", function() {});
	
	temp = document.querySelectorAll(".page-notes .header-filters .note-filter > .selection-each:not(:first-child)")
	for (let i = 0; i < temp.length; i++) {
		temp[i].remove()
	}
	
	setTimeout(function(){
		document.getElementById("note-image-image-value").value = ""
		document.getElementById("note-image-color-value").value = ""
		notes_image_placeholder.setAttribute("src", "")
		notes_filter_array = []
		getNotes()
		createNoteFilters()
		notes_deposit.innerHTML = "";
	}, 150);
}