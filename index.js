const express = require("express")
const server = express()
const cloudinary = require("cloudinary").v2
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
const ejs = require("ejs")
const session = require ("express-session")
const mongodb = require("mongodb")
server.use(
    session({
        secret: "keyboard cat",// prevent unauthhorized access too user session
        resave: false, //save the sssion back to the store ..modified
        saveUninitialized: true, // controls whether to save a section that is new
    })
);
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const multer = require  ("multer")
const nodemailer = require("nodemailer")
const user = require("./Model/User")
const adminschema = require("./Model/admin")
const blog = require("./Model/Blog")
const authenticate = require("./middleware/authenticate");
const path = require("path")
const bodyParser = require("body-parser")
const adminauth= require("./middleware/adminauth");
const UserfeedSchema = require("./Model/userfeed")
const crypto = require("crypto")
const Userfeed = ("UserfeedSchema")
dotenv.config(),
// server.use(cors())
server.set("views", path.join(__dirname,"views"))
server.set("view engine", "ejs")
server.use(express.static(path.join(__dirname, "public")))
server.use(bodyParser.urlencoded({extended:false}))
server.use(cookieParser());
// const secrekey = crypto.randomBytes(64).toString("hex")
//read your env files
 const PORT = process.env.PORT;
 const cors = require("cors")
 const DB_URL = process.env.DB_URL;
 const db_name = process.env.db_name;
 const apikey = process.env.CLOUDINARY_API_KEY
 const secret = process.env.CLOUDINARY_API_SECRET
 const connectDB = require("./config/dbcon")
// const { title } = require("process")
//cloudinary Configuration


  cloudinary.config({ 
    cloud_name: 'ddvsgrboo', 
    api_key: apikey, 
    api_secret: secret 
});
const img = path.join(__dirname,'public/img/uploaded')
//multer
const storage = multer.diskStorage({
    destination: (req, file ,callback)=>{
        callback(null,img)
    },
    filename : (req,file, callback)=>{
        callback(null, file.originalname)
    }
})

//activate multer storage setting
const upload = multer({storage:storage})

//connection of databa 
connectDB()

 //registration
 server.get("/register", (req,res)=>{
            res.render("register")
 })
 server.post("/register", async (req,res)=>{ 
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            const cpassword = req.body.cpassword;
            if(!name || !email || !password || !cpassword){
                return res.status(422).json({error: "please fill the data"})
           }
            const userExist = await user.findOne({email:email});
                if(userExist){
                     return res.status(422).json({error :"user already exist"});
                 }
                    else{
                        const hash = await bcrypt.hash(password, 10)
                        const profile = {  
                            name : name,
                            email: email,
                            isAdmin : false,
                            password : hash,
                            cpassword : cpassword
                        }
                          const feed = await user.create(profile);
                        //send mail
                             const delivered= main("liadiidris22@gmail.com",email);
                        if (delivered){
                             res.render("login")
                          }
                        else{
                            res.status(500).json({error :"something went wrong"})
                        }
                    }   
    })
// user login
server.get("/userlogin",(req,res)=>{
    res.render("login")
})

 //admin route
 server.get("/admin",authenticate,(req,res)=>{
    
})
//creating blogs
server.get("/createblog", (req,res)=>{
    res.render("create")
})

 server.post("/blog", upload.single("imgupload"), async(req, res)=>{
        const blogtitle = req.body.title.trim()
        const blogcategory = req.body.category.trim()
        const blogdescription = req.body.description.trim()
        const blogauthor = req.body.blogauthor.trim()
        const authorcontact = req.body.number.trim()
        const blogimgpath = req.file.path
        let error = []
    try{
        const result =await cloudinary.uploader.upload(blogimgpath,{
            folder : "sample"})
        const blogimg =(result["secure_url"])
         // check database for existing data
        const feed = await blog.findOne({blogtitle:blogtitle})
        if(feed){
        error.push("blog exist")
        }
        if(error.length >= 0){
        console.log(error)
        }
        let blogContent = {blogtitle,blogimg, blogcategory, blogdescription, blogauthor, authorcontact}
        newBlog = blog.create(blogContent)
        if(newBlog){
        res.render("admindash/index", {error:error})}
    }
    catch(error){
        console.log(error)
    }
})
//view service route
server.get("/adminservices",async(req,res)=>{
        const servicee = await blog.find({blogcategory : "service"});
        const serv = []
        servicee.forEach((doc)=>{
            serv.push(doc)
        })
        res.render("admindash/services", {service:serv})
})
//view admin blog route
server.get("/adminblog",async(req,res)=>{
    const blogg = await blog.find();
    const record = []
    blogg.forEach((doc)=>{
        record.push(doc)
    })
     res.render("admindash/adminblog", {blogs:record}) 
})

//view admin about page
server.get("/adminabout",async(req,res)=>{
    const about = await blog.find({blogcategory : "about"});
    const abouts= []
    about.forEach((doc)=>{
        abouts.push(doc)
    })
     res.render("admindash/adminabout", {about:abouts})
})

// VIEW ADMIN PROJECTS
server.get("/adminproject",async(req,res)=>{
    const project = await blog.find({blogcategory : "project"});
    const projects= []
    project.forEach((doc)=>{
        projects.push(doc)
    })
    
    res.render("admindash/adminproject", {project:project})
})
//admin galery
server.get("/admingalery",async(req,res)=>{
    const galery = await blog.find({blogcategory : "galery"});
    const galerys = []
    galery.forEach((doc)=>{
        galerys.push(doc) 
    })
    res.render("admindash/admingalery", {galery:galery})
})

//admin feedbacks
server.get("/adminfeedback",async(req,res)=>{
    const feedback = await UserfeedSchema.find();
     const feedbacks = []
     feedback.forEach((doc)=>{
        feedbacks.push(doc)
    })
    res.render("admindash/adminfeedback", {feedback:feedback})
})

//delete a blog
server.post("/del", (req,res)=>{
    blogtitle = req.body.blogtitle
    blog.deleteOne({blogtitle:blogtitle}).then((res) => console.log(res)).catch((err) => console.error(err))
})
//delete a user
server.get("/deluser",(req,res)=>{
    res.render("admindash/deleteuser")
})
server.post("/deluser", (req,res)=>{
    email = req.body.email
    user.deleteOne({email:email}).then((res) => console.log(res)).catch((err) => console.error(err)) 
    res.redirect("admin")
})
server.get("/update", (req,res)=>{
    res.render("update")
})

//users end point


//contact end point
server.get("/contact", (req,res)=>{
    res.render("contact")
})

//submit feedback from user
server.post("/contact", async (req,res)=>{
    name = req.body.name.trim()
    const email = req.body.email.trim();
    const message = req.body.message.trim();
    if (!name || !email || !message){
        return res.status(422).json({error : "please fill the data"});
    }
    const feed = await UserfeedSchema.create({
        name : name,
        email : email,
        message : message
    });  res.render("contact")
   
})

//galery
server.get("/galery",async(req,res)=>{
    const galery = await blog.find({blogcategory : "galery"});
    const galerys = []
    galery.forEach((doc)=>{
        galerys.push(doc)
    })
    res.render("galery", {galery:galery})
})

// cart
server.get( "/cart", async(req,res)=>{
    const services = await blog.find({blogcategory : "service"});
    const  prodstring = JSON.stringify(services)
    res.send(prodstring)
    //return prodstring
})


//viewing blogs
server.get("/blog",async(req,res)=>{
    const userblog = await blog.find({blogcategory : "blogs"});
    const userb= []
    userblog.forEach((doc)=>{
    userb.push(doc)
    })
    res.render("blog", {userblog:userb})
})


//about route
server.get("/about",async(req,res)=>{
    const about = await blog.find({blogcategory : "about"});
    const abouts= []
    about.forEach((doc)=>{
        abouts.push(doc)
    })
    res.render("about", {about:abouts})
})


// project route
server.get("/projects",async(req,res)=>{
    const project = await blog.find({blogcategory : "project"});
    const projects= []
    project.forEach((doc)=>{
        projects.push(doc)
    })
    res.render("projects", {project:project})
})



//load the user page
server.get("/users", (req,res)=>{
    res.render("index")
})
//view services on user end point

server.get("/services",adminauth, async(req,res)=>{ 

})
//logout
server.post("/logout", (req,res)=>{
    res.clearCookie("token")
    res.redirect("userlogin")
})

 
   
    
    
 //send mail code using nodemailer
 const apppwd = process.env.APP_PWD
 const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
        user: "liadiidris22@gmail.com",
        pass: apppwd,
        },
 });
            async function main(senderemail, receiveremail,) {
                // send mail with defined transport object
            const info = await transporter.sendMail({
            from: `"idris site" ${senderemail}`, // sender address
            to: `${receiveremail}`,
            // list of receivers
            subject: "registration succesfully   ", // Subject line
            text: "thank you for registering to idris website,feel free to navigate through our page",
            });
            }
 
 //end mail

server.get('/search', async (req, res) => {
    const searchQuery = req.query.query;
    console.log(searchQuery)
    if (searchQuery == "undefined" || searchQuery == ""){
        res.send("no data to look up for")
    }
    try {
        const categories = await blog.find({
        blogtitle: { $regex: new RegExp(searchQuery, 'i') }
        });
        res.render('admindash/search', { categories, searchQuery });
    }
    catch(err){
        console.error(err);
        res.status(500).send("An error occurred while searching for categories.");
    }
});
//new update
server.get("/newupdate",async(req,res)=>{
    const db = blog.find()
    let records = [];
    for await (const doc of db){
        records.push(doc);
    }res.render("admindash/update",{blog : records});
})
//new
server.get("/update/:blogId",async (req,res)=>{
    let params = req.params;
    const id = new mongodb.ObjectId(params.blogId);
    console.log("Id:",id);
    const blogs = await blog.findOne({_id:id})
    console.log("blogs",blogs);
    res.render("admindash/update-blog",{blogs});
})
server.post("/update",async(req,res)=>{
    const title = req.body.title.trim();
    const content = req.body.content.trim()
    const price = req.body.price.trim()
    const blogId = new mongodb.ObjectId(req.body.id.trim())
    const update = {$set: {title,content,price}}
    await blog.findOneAndUpdate({_id: blogId})
    res.redirect('admin')
})

server.get("/deletes",async(req,res)=>{
    const db = blog.find()
    let records =[];
    for await (const doc of db){
        records.push(doc);
    }
    res.render("admindash/delete", {blog : records})
})
server.post("/delete",async (req,res)=>{
    let id = req.body.id.trim();
    id = new mongodb.ObjectId(id);
    await blog.deleteOne({_id :id});
    res.redirect("admin")
})


server.get("/alluser",async(req,res)=>{
    const alluser = await user.find();
    const allusers= []
    alluser.forEach((doc)=>{
        allusers.push(doc)
        console.log(allusers)
    })
    res.render("admindash/alluser", {alluser:alluser})
})
server.get("/payment",(req,res)=>{
    res.render("payment")
})

 //cart
    server.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    res.render('cart', { cart });
  });
  
  //userlogin
  server.post("/userlogin", (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    if (!email || !password) {
        return res.status(422).json({ error: "please fill the data" });
    }
    user.findOne({ email: email }).then((savedUser) => {
        if (savedUser["isAdmin"]){
            if (savedUser["email"] == email) {
                bcrypt.compare(password, savedUser.password).then((doMatch) => {
                    if (doMatch) {
                        const token = jwt.sign({ _id: savedUser._id }, "secretkey");
                        const { _id, name, email } = savedUser;
                        res.cookie("token", token, {httpOnly: true})
                        req.session.user = token
                        res.redirect("admin");
                    } 
                    else{
                        return res.status(422).json({ error: "invalid email or password" });
                    }
                });
            }  
        }
        else{
            const token = jwt.sign({ _id: savedUser._id }, "secretkey");
                        const { _id, name, email } = savedUser;
                        res.cookie("token", token, {httpOnly: true})
                        req.session.user = token
                        res.redirect("services")
            }
    });
})

server.get("/update",(req,res)=>{
    res.render("update")
})

server.get("/cartts",(req,res)=>{
    res.render("carttts")
})

  




//you are connecting to the data base here
 const db = mongoose.connection;

 db.once("open", ()=>{
    console.log("connected to database");
    server.listen(PORT, ()=>{
        console.log(`server is running on port ${PORT}`);
    })
 })

db.on("close", ()=>{
    console.log("connection close");
})
