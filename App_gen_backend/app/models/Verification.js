const mongoose = require("mongoose");

const verificationschema = mongoose.Schema({
   token :{
       type : String,
       required : true
   },
   userid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
   },
   createdAt : {
       type : Date,
       default : Date.now()
   }
});
module.exports = mongoose.model("verification", verificationschema);