const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const response = require("../models/response.model")
const user = require("../models/user.model")

const userModel = user.model
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
      {userID : userResponse.id},
      process.env.JWT_SECRETKEY,
      {algorithm: "HS256", expiresIn: "1d"},
    )

    response.statusOk(res, userResponse)
  } catch(error){
    response.statusBadGateway(res, [error.message || "some errors occurred when trying to log in"])
  }
}

exports.getUserByID = async (req, res) => {
  try{
    const foundUser = await userModel.findById(req.params.id)
    if(!foundUser){
      response.statusNotFound(res, [`user with id ${req.params.id} not found`])
      return
    }

    response.statusOk(res, foundUser.toJSON())
  } catch(error) {
    response.statusBadGateway(res, [error.message || "some errors occurred when trying to get user"])
  }
}

exports.updateUser = async (req, res) => {
  try{
    const updatedUser = req.body
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(updatedUser.password, salt)
    updatedUser.password = hashed

    const foundUser = await userModel.findOneAndUpdate(
      {_id : req.userID},
      {$set : updatedUser},
      {new : true}
    )

    response.statusOk(res, foundUser.toJSON())
  } catch(error) {
    response.statusBadGateway(res, [error.message || "some errors occurred when trying to get user"])
  }
}

exports.deleteUser = async (req, res) => {
  try{
    const foundUser = await userModel.findOneAndDelete({_id : req.userID})

    response.statusOk(res, `user with id ${req.userID} successfully deleted`)
  } catch(error) {
    response.statusBadGateway(res, [error.message || "some errors occurred when trying to get user"])
  }
}

exports.getUserRecipes = async (req, res) => {
  try{
    const foundUser = await userModel.findById(req.params.id).populate("recipes")

    if(!foundUser) {
      response.statusNotFound(res, `user with id ${req.params.id} not found`)
      return   
    }

    response.statusOk(res, foundUser)
  } catch(error) {
    response.statusBadGateway(res, error.message || "some errors occurred when trying to get recipes")
  }
}
