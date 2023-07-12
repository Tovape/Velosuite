import jwt from "jsonwebtoken";
import fs from 'fs';
import { randomString } from "./ctrl.controller.js"
var temp = null;

/* GET - Get Note */

export const getNotes = async (req, res) => {
	var notes = [];
	
	const fileList = fs.readdirSync('./content/notes/');
	for (const filename of fileList) {
		temp = fs.readFileSync('./content/notes/' + filename, 'utf8');
		notes.push([filename, temp]);
	}
	
	return res.status(200).json({notes: notes, message: "Notes loaded", status: 0})
}

/* POST - Create Note */

export const createNote = async (req, res) => {
	if (!req.body.title) {
		return res.status(403).json({message: "No title provided", status: 1})
	}
	
	temp = new Date();
	const yyyy = temp.getFullYear();
	const mm = temp.getMonth() + 1;
	const dd = temp.getDate();
	temp = dd + '/' + mm + '/' + yyyy;
	
	var newString = req.body.title.replace(/[^A-Z0-9]/ig, "_");
	
	if (fs.existsSync('./content/notes/' + newString + '.json')) {
		newString += "-" + randomString(5)
	}
	
	var newData = {
		"title": req.body.title,
		"category": "",
		"creationDate": temp,
		"modifiedDate": temp,
		"backgroundImage": "",
		"backgroundColor": "#6D94DB",
		"filename": newString,
		"content": ""
	};
	
	fs.appendFile('./content/notes/' + newString + '.json', JSON.stringify(newData), function (err) {
		if (err) throw err;
		return res.status(200).json({message: "Note Created", status: 0, note: newData})
	});
}

/* POST - Update Note */

export const updateNote = async (req, res) => {
	if (!req.body.filename) {
		return res.status(403).json({message: "No filename provided", status: 1})
	}

	if (fs.existsSync('./content/notes/' + req.body.filename)) {		
		temp = new Date();
		const yyyy = temp.getFullYear();
		const mm = temp.getMonth() + 1;
		const dd = temp.getDate();
		temp = dd + '/' + mm + '/' + yyyy;
			
		var updateData = {
			"title": req.body.title,
			"category": req.body.category,
			"modifiedDate": temp,
			"backgroundImage": req.body.backgroundImage,
			"backgroundColor": req.body.backgroundColor,
			"content": req.body.content
		};

		fs.writeFile('./content/notes/' + req.body.filename, JSON.stringify(updateData), err => {
			if (err) throw err;
			return res.status(200).json({message: "Note updated", status: 0})
		});

	} else {
		return res.status(403).json({message: "File doesn't exist", status: 1})
	}
}

/* DELETE - Delete Note */

export const deleteNote = async (req, res) => {
	if (!req.body.filename) {
		return res.status(403).json({message: "No filename provided", status: 1})
	}
	
	fs.unlink('./content/notes/' + req.body.filename, (err) => {
		if (err) {}
	}); 

	return res.status(200).json({message: "Note deleted", status: 0})
}
