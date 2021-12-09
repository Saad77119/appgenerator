const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const { success , error} = require("../helpers/responseApi");
const UserScheme = mongoose.Schema({
    name : {
        type : String ,
        required : [true, 'Name is required'] ,
        minLength : [2 , 'Write Minimum 2 Characters in Name ']
    },
    gender : {
        type : String ,
        required : true ,
        enum : ["male","female"]
    },
    email : {
        type : String ,
        required : [true ,'Email is required',],
        unique : [true , 'Email Already exists'],
        validate : [ isEmail , 'invalid email ']
    },
    password : {
        type : String ,
        required : true ,
    },
    confirmPassword : {
      type : String
    },
    isActive : {
      type : Boolean,
      required : true,
      default : 0

    },
    tokens : [{
        token: {
            type: String,
        }
    }],
    createdAt : {
        type : Date,
        default : Date.now(),
    },
    updatedAt : {
        type : Date,
        default : Date.now(),
    }
});
UserScheme.methods.UserOAuth = async function(token){
   try {
       this.tokens = this.tokens.concat({token: token});
       await this.save();
   }catch (err) {
       return error("Token is not saved",400);
   }
}
UserScheme.pre('save',async function(next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
    this.confirmpassword = undefined;
    }
    next();
});

UserScheme.pre('updateOne',async function(next) {
    this.set({ updatedAt: new Date() });
    next();
});

module.exports = mongoose.model("User", UserScheme);