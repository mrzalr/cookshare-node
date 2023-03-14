const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  username : {
    type : String,
    required : true,
    index : {
      unique : true
    }
  },
  email : {
    type : String,
    required : true,
    index : {
      unique : true
    }
  },
  password : {
    type : String,
    required : true
  },
  recipes : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Recipe"
  }]
}, { timestamps : true })

userSchema.method("toJSON", function(){
  const {__v, _id, password,  ...object} = this.toObject()
  return { id : _id, ...object}
})

const register = body => {
  const validationErrs = []
  if(body.username === undefined || body.username === ""){
    validationErrs.push("username should not be empty")
  }
  if(body.email === undefined || body.email === ""){
    validationErrs.push("email should not be empty")
  }
  if(body.password === undefined || body.password === ""){
    validationErrs.push("password should not be empty")
  }

  return validationErrs
}

const login = body => {
  const validationErrs = []
  if(body.email === undefined || body.email === ""){
    validationErrs.push("email should not be empty")
  }
  if(body.password === undefined || body.password === ""){
    validationErrs.push("password should not be empty")
  }

  return validationErrs
}

module.exports = {
  model : mongoose.model("User", userSchema),
  validator : {
    register,
    login
  }
}
