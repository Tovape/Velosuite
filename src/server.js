import express from "express";
import morgan from "morgan";
//import userRoutes from "./routes/user.routes.js";
import { alreadyLogged, authorization } from "./middleware/middleware.js";
import "./database.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import favicon from "serve-favicon";
import bodyParser from "body-parser";
import packagejson from '../package.json' assert { type: 'json' };
const __dirname = path.resolve();
const app = express();
const port = 3000;

// USE
app.use(morgan("dev"))
app.set('view-engine', 'ejs')
app.use(express.static(path.join(__dirname)));
app.use(favicon(__dirname + '/files/images/icons/favicon.ico'));
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({limit: '20mb', extended: true}));
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
app.use(cookieParser());

// GET
app.get("/", (req, res) => {
	res.render('index.ejs'),
	app.use(express.static(__dirname + '/css')),
	app.use(express.static(__dirname + '/files')),
	app.use(express.static(__dirname + '/js'))
})

// Other
app.listen(port)
console.log(`
 __     __   _                 _ _       
 \\ \\   / /__| | ___  ___ _   _(_) |_ ___ 
  \\ \\ / / _ \\ |/ _ \\/ __| | | | | __/ _ \\
   \\ V /  __/ | (_) \\__ \\ |_| | | ||  __/
    \\_/ \\___|_|\\___/|___/\\__,_|_|\\__\\___|

`);
console.log('\t' +  '\x1b[36m', 'Server Port ' + port + '\x1b[0m')
console.log('\t' +  '\x1b[33m', 'Version ' + packagejson.version + '\x1b[0m')