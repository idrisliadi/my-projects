const mongoose = require("mongoose")

const connetDB = async() =>{
    try{
        const connDB = await mongoose.connect(process.env.DB_URL,{
            
        })
    }catch(error){
        console.log("connection error" + error);
    }
}

module.exports = connetDB