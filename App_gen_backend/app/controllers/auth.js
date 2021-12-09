/**
 * @desc Import Files
 */
const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verificaton = require("../models/Verification");
const events = require("events");
const { randomString } = require("../helpers/randomstring");
const mail = require("../events/mail");
const { success,error,validation } = require("../helpers/responseApi")
/**
 * @desc    Render Register page
 * @method  GET  auth/register
 * @access  public
 */
exports.registerpage = async(req,res)=>{
    res.render("index",{title:"Register"});
}
/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @desc Render login page
 * @method GET auth/login
 */
exports.loginpage = async (req,res)=>{
    res.render("login",{title:"Login"});
}
/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @desc Register User
 * @method POST auth/register
 */
exports.register = async (req,res)=>{
    var eventEmitter = new events.EventEmitter();
    const { name , email , gender , password , confirmpassword } = req.body;
    let newUser = new User({
        name,
        email,
        gender,
        password,
        confirmpassword,
        isActive : 0
    });
    try{
        let pattern = new RegExp("^(?=(.*[a-zA-Z]){1,})(?=(.*[0-9]){2,}).{8,}$");
        if(!(await password.match(pattern))){
            return res.status(400).json(error("Password Must have 8 Character with 2 Numbers",400));
        }
        if(password !== confirmpassword ){
          return res.status(400).json(error("Password and Confirm does not match",400));
        }

     let Useradded = await newUser.save();

     let randstr = await randomString(20);
    let verifyUrl = `http://localhost:9999/auth/verify/${randstr}`;
     let verifyUser = new verificaton({
        token : randstr,
        userid : Useradded._id
     });
          await verifyUser.save();

        eventEmitter.on('mail', async function(url,email){
            await mail.verificatiomail(url,email);
        })
        eventEmitter.emit('mail',verifyUrl , Useradded.email );
        res.status(200).json(success("User Successfuly Registerd",{
            name : Useradded.name,
            email : Useradded.email
        },200))

}catch (err) {
        if(err.code === 11000) res.status(400).json(error("Email Already Exists",400));
       res.status(400).json(error(err.message,400));
    }
}
/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @desc Login User
 * @method POST auth/login
 */
exports.login = async(req,res)=>{
    const {email,password} = req.body;
    try{
        let userfind = await User.findOne({email:email});
        if(!userfind) return res.status(404).json(error("User Not Found",404));
        if(userfind.isActive === false ){
            return res.status(400).json(error("User is not Active",400));
        }
        if(await bcrypt.compare(password , userfind.password )){
           const token = jwt.sign({
                _id : userfind._id,
                email : userfind.email,
            },process.env.SECRET_KEY);
            await userfind.UserOAuth(token);
           res.cookie("token",token ,{
               expires : new Date(Date.now()+500000),
               httpOnly :true
           });
           res.cookie("name",userfind.name);
            res.cookie("email",userfind.email);
           res.status(200).json(success("User Successfuly Login",{
                name : userfind.name,
                email : userfind.email,
            },200))

        }else{
            return res.status(400).json(error("Incorrect Password",400));
        }
    }catch (err) {
        return res.status(400).json(error(err.message,400));

    }
}
/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @desc  change password page
 * @method GET auth/changepassword
 */
exports.changePasswordpage = async (req,res)=>{
    res.render("changePassword",{title:"Change Password"});
};
/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @desc  change password page
 * @method GET auth/ForgetPassword
 */
exports.ForgetPassword = async (req,res)=>{
    res.render("ForgetPassword",{title:"Forget Password"});
};
/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @desc  change password page
 * @method POST auth/ForgetPassword
 */
exports.PostForgetPassword = async (req,res)=>{
    const { email } = req.body;
    try{
        const searcheduser = await User.findOne({email : email});
        if(!searcheduser){
            return res.status(404).json(error("User Not Found",404));
        }else{
            var eventEmitter = new events.EventEmitter();
            eventEmitter.on('mail', async function(url,email){
                await mail.verificatiomail(url,email);
            })
            let randstr = searcheduser._id;
            let verifyUrl = `http://localhost:9999/auth/ChangePassword/${randstr}`;

            eventEmitter.emit('mail',verifyUrl , email );
            res.status(200).json(success("Check Your Mail ",[],200));
        }
    }catch (err) {
         res.status(400).json(error(err.message,400));
    }

};


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @desc  change password page
 * @method POST auth/changepassword
 */
exports.changePassword = async (req,res)=>{
 const { id , password , confirmpassword } = req.body;
 try{
     console.log(id);
    if(password !== confirmpassword){
        return res.status(400).json(error("Password and Confirm Password does not match",400));
    }
    else{
       let hashpassword = await bcrypt.hash( password, await bcrypt.genSalt(10));
     await User.updateOne({_id : id },{
         $set : {
             password : hashpassword
         },
     })
     res.status(200).json(success("Password is Changed" , [],200));

    }
 }catch (err) {
     res.status(400).json(error(err.message,400));
 }
};
/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @desc Verify User after register
 * @method GET auth/verify/id
 */
exports.verify = async ( req , res )=>{
    try{
        if(req.params.id){
            let token = req.params.id;
            let verifeditem = await verificaton.findOne({token:token});
             await User.updateOne({_id:verifeditem.userid}, {
                $set: {
                    isActive : true
                }
            });
            await verificaton.findByIdAndRemove({_id:verifeditem._id});

        }
        res.render("verify",{title:"Verify"});

    }
    catch (err) {
        res.status(400).json(error(err.message,400));

    }
}
/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @desc confirmPassword  after register
 * @method GET auth/verify:id
 */
exports.confirmPassword = async(req,res)=>{
    res.render("confirmPassword",{title:"Confirm Password"});

}
/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @desc confirmPassword  after register
 * @method GET auth/verify:id
 */
exports.logout = async(req,res)=>{
    let email = req.cookies.email;
    try{
    let user = req.user;
    let tokens = user.tokens;
    tokens.forEach((item ,index)=>{
        if(item.token === req.cookies.token ){
            tokens.splice(index,1);

        }
    })
        let cookies = ["token","name","email"]
        cookies.forEach((item)=>{
        res.clearCookie(item);
    })

        await user.save();
    res.redirect("/auth/login");
    }catch (err) {
        res.status(400).json(error(err.message,400));
    }
}