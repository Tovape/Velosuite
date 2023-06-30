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
	var newData = {
		"title": req.body.title,
		"category": null,
		"creationDate": temp,
		"modifiedDate": temp,
		"backgroundImage": null,
		"backgroundColor": "#FEC870",
		"filename": newString,
		"content": ""
	};

	if (fs.existsSync('./content/notes/' + newString + '.json')) {
		newString += "-" + randomString(5)
	}
	
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
	
	
	
	return res.status(200).json({message: "Note updated", status: 0})
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
