import General from "../models/General.js";
import mongoose from "mongoose";
import { beginSetup, endSetup, changeTheme } from "../server.js";

/* Setup Check */

export function generalCheck(conn) {
	conn.on('open', function () {
		General.count().then((data) => {
			if (data == 0) {
				console.log('\t' +  ' Setup Initialised' + '\n')		
				beginSetup()				
			}
		})
	});
}

/* Setup Process */

export const ctrlSetup = async (req, res) => {
	if (!req.body.username) {
		return res.status(403).json({message: "No username provided", status: 1})
	}

	const newGeneral = new General({
		username: req.body.username,
		setup: true
	})
	
	await newGeneral.save();
	endSetup()
	console.log('\t' +  ' Setup Finished' + '\n')
	return res.status(200).json({message: "Setup Finished", status: 0})
}

/* Theme Change */

export const ctrlThemeChange = async (req, res) => {
	if (!req.body.theme) {
		return res.status(403).json({message: "No theme provided", status: 1})
	}
	
	const updatedTheme = await General.updateOne({setup:true}, {theme:req.body.theme})
	changeTheme(req.body.theme)
	
	return res.status(200).json(updatedTheme)
}