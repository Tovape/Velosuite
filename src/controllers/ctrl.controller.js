import { beginSetup, endSetup, changeTheme, loadGeneral, writeGeneral, getGeneral } from "../server.js";

/* Setup Check */

export function generalCheck(general) {
	if (general.setup === false) {
		console.log('\t' +  ' Setup Initialised' + '\n')		
		beginSetup()		
	}
}

/* Setup Process */

export const ctrlSetup = async (req, res) => {
	if (!req.body.username) {
		return res.status(403).json({message: "No username provided", status: 1})
	}

	var data = {
		"username": req.body.username,
		"password": "",
		"theme": "default",
		"setup": true		
	}

	writeGeneral(data)
	loadGeneral()
	endSetup()
	console.log('\t' +  ' Setup Finished' + '\n')
	return res.status(200).json({message: "Setup Finished", status: 0})
}

/* Theme Change */

export const ctrlThemeChange = async (req, res) => {
	if (!req.body.theme) {
		return res.status(403).json({message: "No theme provided", status: 1})
	}
	
	var data = getGeneral();
	
	data.theme = req.body.theme
	
	writeGeneral(data)
	loadGeneral()
	changeTheme(req.body.theme)
	
	return res.status(200).json({message: "Theme Changed", status: 0})
}