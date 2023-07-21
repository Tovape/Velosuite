import jwt from "jsonwebtoken";
import { getGeneral, secureApi } from "../server.js";

export const alreadyLogged = (req, res, next) => {
	const data = getGeneral()
	if (data.password == null || data.password == "undefined" || data.password == "") {
		res.redirect('/');
	} else {
		if (req.cookies.token) {
			try {
				const token = jwt.verify(req.cookies.token, secureApi())
				if (token != "undefined" && token != null) {
					if (data.password === token.password) {
						res.redirect('/');
					} else {
						res.cookie('token', '', { httpOnly: false })
						next()
					}
				} else {
					res.cookie('token', '', { httpOnly: false })
					next()
				}
			} catch (err) {
				console.log(err)
			}
		} else {
			next()
		}
	}
};

export const authorization = (req, res, next) => {
	const data = getGeneral()
	if (data.password == null || data.password == "undefined" || data.password == "") {
		next()
	} else {
		if (req.cookies.token) {
			try {
				const token = jwt.verify(req.cookies.token, secureApi())
				if (token != "undefined" && token != null) {
					if (data.password === token.password) {
						next()
					} else {
						res.cookie('token', '', { httpOnly: false })
						res.redirect('/login');
					}
				} else {
					res.cookie('token', '', { httpOnly: false })
					res.redirect('/login');
				}
			} catch (err) {
				console.log(err)
			}
		} else {
			res.redirect('/login');
		}
	}
};