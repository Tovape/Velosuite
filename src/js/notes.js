/* Notes */
var notes_deposit = null
var notes_each = null;
var notes_filter = null
var notes_delay;
var notes_filter_array = [];
var notes_interval = null;
var notes_content = [];

document.addEventListener("DOMContentLoaded", function(event) {
	notes_deposit = document.getElementById("notes-deposit")
});

// Note Event Listeners
function createNoteEvents() {
	notes_filter = document.querySelectorAll(".page-notes .note-filter .selection-each > input")
	notes_each = document.querySelectorAll(".page-notes .note-each")
	
	// Note Click
	for (var i = 0, j = notes_each.length; i < j; i++) {
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
				<div class="note-each lag" creationDate="` + temp.creationDate + `" modifiedDate="` + temp.modifiedDate + `" category="` + temp.category + `" id="` + data.notes[i][0] + `" style="background-color: ` + temp.backgroundColor + `;">
					<p class="title">` + temp.title + `</p>
					<p class="date">` + temp.modifiedDate + `</p>
					` + temp2 + `
				</div>	
				`)
				notes_content.push({
					"id": data.notes[i][0],
					"title": temp.title,
					"category": temp.category,
					"content": temp.content
				})
			}
			console.log(notes_content)
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
		selector: "#tinymce-og"
	});
	noteBeginInterval(id)
	/*tinyMCE.activeEditor.setContent();*/

	var result = notes_content.filter(obj => {
		return obj.id === id
	})
		
	document.getElementById('note-current-title').setAttribute("value", result[0].title)
	document.getElementById('note-current-title').addEventListener('input', function() {
		this.style.width = this.value.length + 'ch'
	})
	document.getElementById('note-current-title').style.width = document.getElementById('note-current-title').value.length + 'ch'
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
			<div class="note-each lag" creationDate="` + data.note.creationDate + `" modifiedDate="` + data.note.modifiedDate + `" category="` + data.note.category + `" id="` + data.note.filename + `.json" style="background-color: ` + data.note.backgroundColor + `;">
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
	/*tinymce.get("mytextarea").getContent()
	 Here you must get the content from tinymce, the category, name etc and update it in the backend 
	
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
	*/
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

// Note Save Interval
function noteBeginInterval(filename) {
	notes_interval = setInterval(updateNote, 5000);
}

function noteEndInterval() {
	clearInterval(notes_interval);
	document.getElementById('note-title').removeEventListener("input", function() {});
}