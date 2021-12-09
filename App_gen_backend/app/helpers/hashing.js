import bcrypt from "bcrypt";
const bycrypt = require("bcrypt");


exports.passwordhash = async (password)=>{
    return bcrypt.hash(password, 10);
}