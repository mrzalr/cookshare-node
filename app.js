const dotenv = require("dotenv")
dotenv.config()

const model = require("./app/models/model")
model.mongoose
    .connect(process.env.MONGO_URI, {useNewUrlParser: true})
    .then(() => { console.log("Successfully connected to mongodb") })
    .catch(err => { 
        console.log(`Failed to connect to mongodb | err : ${err}`)
        process.exit() 
    })

const express = require("express")
const app = express()
const port = process.env.SERVER_PORT || 8000

app.use(express.json())
require("./app/routers/user.router")(app)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
