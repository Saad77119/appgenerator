/**
 * @desc this is main file of project where everything is define and server runs
 * @author Saad Raza
 * @since 2021

 **/
//import files
require('dotenv').config()
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const Authrouter  = require("./app/routes/auth");
const homerouter  = require("./app/routes/homeroute");
const db = require("./config/db")
const port = process.env.PORT || 8000;
const user = require("./app/models/User");
const val = require("./app/models/Verification");

//make instance of express
const app = express();


//DB Connection
db.connectDb();


//Allow static files
let static_files_directory = path.join(__dirname, 'app','public');
console.log(static_files_directory);
app.use(express.static(static_files_directory));


//Register Ejs Template
app.set('view engine', 'ejs');


//modify ejs directory
let views_directory = path.join(static_files_directory, 'views');
app.set("views",views_directory);


// parse the request in json
app.use(bodyParser.json())


//cookie Parser
app.use(cookieParser());


//Add home Route
app.use("" ,homerouter);

//add Authentication Route
app.use("/auth" , Authrouter);


app.listen(port,()=>{
    console.log(`Server is running at ${port}`);
})