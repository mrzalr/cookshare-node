const db = require("../models/model")
const User = db.UserModel

const createUser = async (req, res) => {
  console.log(req.body)
  if(req.body.username === null || req.body.email === null || req.body.password === null){
    res.status(400).json({
      status : 400,
      message : "bad request",
      errors : ["username, email, password shouldn't be null"],
      data : null
    })
  }

  const user  = new User({
    username : req.body.username,
    email : req.body.email,
    password : req.body.password
  })

  try{
    const userResponse = await User.save()
    res.status(201).json({
      status : 201,
      message : "created",
      errors : [],
      data : userResponse
    })
  } catch(error){
    res.status(500).json({
      status : 500,
      message : "bad gateway",
      errors : [ errors.message || "error when inserting new data" ],
      data : null
    })
  }
}

module.exports = { createUser }
