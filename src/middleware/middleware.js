import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
	try {
		const token = req.headers["x-access-token"];

		console.log(token)

		if (!token) return res.status(403).json({message: "No token provided"})

		const decoded = jwt.verify(token, "user-api-signed")
		req.userId = decoded.id;

		const user = await User.findById(req.userId, {password: 0})
		if (!user) return res.status(404).json({message: "No User Found"})

		next()
	} catch (e) {
		console.log(e)
		return res.status(401).json({message: "Auth Error"})
	}
}

export const checkDuplicate = async (req, res, next) => {
	
	const user = await User.findOne({username: req.body.username})

	if (user) {
		return res.json({message: "User Already Extists"})
	}
	
	const email = await User.findOne({email: req.body.email})
	
	if (email) {
		return res.json({message: "Email Already Extists"})
	}
	
	next()
}

export const authorization = (req, res, next) => {
	
	var token = null;
	if (req.cookies.token) {
		token = req.cookies.token;
		token = ((JSON.parse(token))["token"])
	}
	
	if (token == null || token == "undefined") {
		res.redirect("/login")
	} else {
		try {
			const data = jwt.verify(token, "user-api-signed");
			if(data) {
				next()
			}
		} catch {
			res.redirect("/login")
			return res.sendStatus(403);
		}
	}
};

export const alreadyLogged = (req, res, next) => {
	var token = null;
	if (req.cookies.token) {
		token = req.cookies.token;
		token = ((JSON.parse(token))["token"])
	}
	
	if (token != null) {
		const data = jwt.verify(token, "user-api-signed");
				
		if((data) && (Object.keys(data).length !== 0)) {
			res.redirect("/account")
		} else {
			res.sendStatus(403).json({message: "An Error Accured"})
		}
	} else {
		next()
	}
};
