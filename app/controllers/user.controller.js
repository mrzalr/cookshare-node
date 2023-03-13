const response = require("../models/response.model")
const user = require("../models/user.model")

const userModel = user.model()
const userValidator = user.validator

exports.createUser = async (req, res) => {
  const validationErrs = userValidator(req.body)
  if(validationErrs.length > 0) {
    response.statusBadRequest(res, validationErrs)
    return
  }

  const {username, email, password} = req.body
  try{
    const userResponse = await userModel.create({
      username,
      email,
      password
    })
    
    response.statusCreated(res, userResponse)
  }catch(error){
    response.statusBadGateway(res, [error.message])
  }
}
