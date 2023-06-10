import mongoose from "mongoose";
const mongoURI = 'mongodb://velosuite:123456@localhost:27017/Velosuite'
const conn = mongoose.createConnection(mongoURI);
import { generalCheck } from "./controllers/general.controller.js";

mongoose.connect(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(
	db => console.log('\t' +  '\x1b[32m', 'MongoDB Connected' + '\x1b[0m' + '\n\n'),
	generalCheck(conn)
)
.catch(error => console.log(error))