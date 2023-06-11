import General from "../models/General.js";
import mongoose from "mongoose";
import "../database.js";
import { beginSetup } from "../server.js";

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

//localhost:3000/api/ctrl/45
export const ctrlSetup = async (req, res) => {
	if (false) return res.status(403).json({message: "No token provided"})
	res.json({"posts": "a"})

	/*
	const newGeneral = new General({
	})
	
	const newGeneral = await newPost.save();
	*/
}