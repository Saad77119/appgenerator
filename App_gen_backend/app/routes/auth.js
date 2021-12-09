const express = require("express");
const Authroute = express.Router()
const { registerpage ,
        loginpage ,
        register ,
        confirmPassword ,
        verify ,
        login ,
        ForgetPassword,
        PostForgetPassword ,
        changePasswordpage ,
        changePassword,
        logout } = require("../controllers/auth");
const { jwtverification } = require("../middleware/jwtverification")

Authroute.get("/register", registerpage );
Authroute.get("/login", loginpage );
Authroute.post("/login", login );
Authroute.post("/register", register);
Authroute.get("/confirmPassword", confirmPassword);
Authroute.get("/verify/:id", verify);
Authroute.get("/ForgetPassword",ForgetPassword);
Authroute.post("/ForgetPassword",PostForgetPassword);
Authroute.get("/ChangePassword/:id", changePasswordpage);
Authroute.post("/ChangePassword", changePassword);
Authroute.get("/logout" , jwtverification,logout);

module.exports = Authroute;
