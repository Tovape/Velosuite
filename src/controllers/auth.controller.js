import jwt from "jsonwebtoken";
import { getGeneral, secureApi } from "../server.js";

export const signIn = async (req, res) => {
	const { username, password } = req.body;

	const data = getGeneral()

	if (data.password !== password) { 
		return res.json({ message: "Wrong Password", status: 1 }) 
	}
	
	if (data.username !== username) { 
		return res.json({ message: "Wrong Username", status: 1 }) 
	}
	
	const token = jwt.sign({password: data.password}, secureApi(), {
		expiresIn: 84600
	})

	res.cookie('token', token, { httpOnly: false })
	return res.status(200).json({ status: 0, message: "Logged In" })
}