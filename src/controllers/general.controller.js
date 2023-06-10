import General from "../models/General.js";
import mongoose from "mongoose";
import "../database.js";

/* Setup Check */

export function generalCheck(conn) {
	conn.on('open', function () {
		General.count().then((data) => {
			if (data == 0) {
				console.log('\t' +  ' Setup Initialised' + '\n')
			}
		})
	});
}