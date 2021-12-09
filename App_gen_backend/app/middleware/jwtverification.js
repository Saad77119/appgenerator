const jwt = require("jsonwebtoken");
const {error } = require("../helpers/responseApi")
const user = require("../models/User")
exports.jwtverification = async(req,res,next)=>{
    try{

        if(!req.cookies.token){
         return    res.redirect("/auth/login");
        }
        const userinfo = await jwt.verify(req.cookies.token,process.env.SECRET_KEY);
        if(!(await jwt.verify(req.cookies.token,process.env.SECRET_KEY))){

           return  res.redirect("/auth/login");
        }else{
            let checktokenindb = false;
           verifieduser = await  user.findOne({_id:userinfo._id});
            let verifiedusertoken = verifieduser.tokens;
            verifiedusertoken.forEach((item, index)=>{
                if(item.token === req.cookies.token){
                    checktokenindb = true;
                }
            });
            if(checktokenindb === false){
                  res.cookies.clear();
                  res.redirect("/auth/login");
            }

        }
        req.user = verifieduser ;
        req.token = req.cookies.token;
        next();
    }catch (err) {
         res.status(401).json(error(err.message,401));
    }
}