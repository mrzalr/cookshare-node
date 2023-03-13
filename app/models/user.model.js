const mongoose = require("mongoose")

const model = () => {
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
    }
  }, { timestamps : true })

  userSchema.method("toJSON", function(){
    const {__v, _id, password,  ...object} = this.toObject()
    return { id : _id, ...object}
  })

  return mongoose.model("user", userSchema)
}

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
  model : model,
  validator : {
    register,
    login
  }
}