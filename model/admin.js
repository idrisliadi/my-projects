 const { name } = require("ejs")
const mongoose = require("mongoose")
 const Adminschema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required :true
    },
    isAdmin : {
        type : Boolean,
         default :true}
   
 });
 Adminschema.pre("save", async function(next){
    if (this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
 })
 module.exports = mongoose.model("admin", Adminschema)