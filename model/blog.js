const mongoose = require("mongoose")
const blogSchema = new mongoose.Schema({
    blogtitle:{
        type:String,
        required:true
    },
    blogimg:{
        type:String,
        required:false
    },
    blogcategory:{
        type:String,
        require:false
    },
   
    blogdescription:{
        type:String,
        required:true
    },
    blogauthor:{
        type:String,
        required:false
    },
    authorcontact:{
        type:Number,
        required:false
    },
    blogcategory:{
        type:String,
        require:false
    },
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("Blog", blogSchema)