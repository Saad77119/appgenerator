/**
 * @desc Import Files
 */
const express = require("express");
const User = require("../models/User");

/**
 * @desc    Render Home page
 * @method  GET  /home
 * @access  public
 */
exports.home = async(req,res)=>{
    let name = req.user.name;
    res.render("home" , {name:name,title:"Home"});
}
