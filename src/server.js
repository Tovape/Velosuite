import express from "express";
import noteRoutes from "./routes/note.routes.js";
import authRoutes from "./routes/auth.routes.js";
import ctrlRoutes from "./routes/ctrl.routes.js";
import { generalCheck } from "./controllers/ctrl.controller.js";
import { alreadyLogged, authorization } from "./middleware/middleware.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from "url";
import favicon from "serve-favicon";
import bodyParser from "body-parser";
import packagejson from '../package.json' assert { type: 'json' };
import dotenv from 'dotenv';
dotenv.config()
const secure_api = process.env.SECURE_API
const __dirname = path.resolve();
const app = express();
const port = 3000;

// Other Variables
var lock_setup = false;
var theme_selected = 0;
var theme_list = [];
var theme_name = "default";
var clock_selected = "digital";
var weather_selected = "celsius";
var weather_units = ["celsius", "fahrenheit"]
var general = null;

// Firewall
app.all(['/server.js', '/database.js', '/controllers/*', '/middleware/*', '/models/*', '/routes/*'], function (req,res, next) {
   res.status(403).send({ message: 'Access Forbidden' });
});

// USE
app.set('view-engine', 'ejs')
app.use(express.static(path.join(__dirname)));
app.use(favicon(__dirname + '/files/images/icons/favicon.ico'));
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({limit: '20mb', extended: true}));
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
app.use(cookieParser());
app.use("/api/note", noteRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/ctrl", ctrlRoutes)

// GET
app.get("/", authorization (req, res) => {
	if (lock_setup) {
		resSetup(req, res)
	} else {
		resIndex(req, res)
	}
})

app.get("/login", (req, res) => {
	if (lock_setup) {
		resSetup(req, res)
	} else {
		resLogin(req, res)
	}
})

function resIndex(req, res) {
	res.cookie('token', secure_api, { httpOnly: false })
	res.render('index.ejs', { theme_list: theme_list, theme_name: theme_name, weather_units: weather_units, weather_selected: weather_selected, clock_selected: clock_selected })
}

function resSetup(req, res) {
	res.render('setup.ejs', { theme_list: theme_list, theme_name: theme_name })
}

function resLogin(req, res) {
	res.render('login.ejs', { theme_list: theme_list, theme_name: theme_name })
}

// Database JSON
export function loadGeneral() {
	try {
		general = JSON.parse(fs.readFileSync('./content/general.json'))
	} catch (err) {
		console.log('\n' +  '\x1b[31m', "Exeption: Couldn't load General.json" + '\x1b[0m');
		general = null;
	}
}

export function getGeneral() {
	return general;
}

export function writeGeneral(data) {
	fs.writeFileSync('./content/general.json', JSON.stringify(data));
}

loadGeneral()

// Setup
export function beginSetup() { lock_setup = true; }
export function endSetup() { lock_setup = false; }

// Theme
fs.readdir(__dirname + '/files/themes', function (err, filesPath) {
    if (err) throw err;
    theme_list = filesPath.map(function (filePath) {
        return filePath;
    });
	if(!theme_list.includes('default')) {
		console.log('\n' + '\x1b[31m', "Exeption: Default theme not found", '\x1b[0m')
		process.exit(1);
	}
});

export function changeTheme(theme) { theme_name = theme; }

// Weather
export function changeWeather(weather) { weather_selected = weather; }

// Clock
export function changeClock(clock) { clock_selected = clock; }

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
if (general !== null) {
	console.log('\t' +  '\x1b[32m', 'Data Loaded' + '\x1b[0m' + '\n\n');
	generalCheck(general)
}