const express = require("express");
const homeroute = express.Router();
const { jwtverification } = require("../middleware/jwtverification");
const { home} = require("../controllers/home") ;
homeroute.get('/home',jwtverification, home);

module.exports = homeroute;
