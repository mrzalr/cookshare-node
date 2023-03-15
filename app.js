const dotenv = require("dotenv")
dotenv.config()

const mongoose = require("mongoose")
mongoose
    .connect(process.env.MONGO_URI, {useNewUrlParser: true})
    .then(() => { console.log("Successfully connected to mongodb") })
    .catch(err => { 
        console.log(`Failed to connect to mongodb | err : ${err}`)
        process.exit() 
    })

const multer = require("multer")
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "images")
  },
  filename: function(req, file, cb){
    cb(null, `${file.originalname}-${new Date().getTime()}`)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
      callback(null, true)
    } else {
      callback(null, false)
    }
  }
})

const express = require("express")
const app = express()
const port = process.env.SERVER_PORT || 8000

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(upload.single("image"))

require("./app/routers/auth.router")(app)
require("./app/routers/user.router")(app)
require("./app/routers/recipe.router")(app)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
