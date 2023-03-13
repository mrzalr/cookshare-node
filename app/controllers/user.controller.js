const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const response = require("../models/response.model")
const user = require("../models/user.model")

const userModel = user.model()
const userValidator = user.validator

exports.register = async (req, res) => {
  const validationErrs = userValidator.register(req.body)
  if(validationErrs.length > 0) {
    response.statusBadRequest(res, validationErrs)
    return
  }

  const {username, email, password} = req.body
  try{
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    const userResponse = await userModel.create({
      username,
      email,
      password : hashed
    })
    
    response.statusCreated(res, userResponse)
  } catch(error){
    response.statusBadGateway(res, [error.message || "some errors occurred when trying to register"])
  }
}

exports.login = async (req, res) => {
  const validationErrs = userValidator.login(req.body)
  if(validationErrs.length > 0) {
    response.statusBadRequest(res, validationErrs)
    return
  }

  const {email, password} = req.body
  try{
    const foundUser = await userModel.findOne({email})
    if(!foundUser){
      response.statusUnauthorized(res, ["email or password invalid"])
      return
    }

    const authenticated = await bcrypt.compare(password, foundUser.password)
    if(!authenticated){
      response.statusUnauthorized(res, ["email or password invalid"])
      return
    }

    const userResponse = foundUser.toJSON()
    userResponse.token = jwt.sign(
      {user_id : userResponse.id},
      process.env.JWT_SECRETKEY,
      {algorithm: "HS256", expiresIn: "1d"},
    )

    response.statusOk(res, userResponse)
  } catch(error){
    response.statusBadGateway(res, [error.message || "some errors occurred when trying to log in"])
  }
}
