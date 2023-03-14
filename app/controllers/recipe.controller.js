const response = require("../models/response.model")
const recipe = require("../models/recipe.model")

const recipeModel = recipe.model
const recipeValidator = recipe.validator

exports.addRecipe = async (req, res) => {
  const validationErrs = recipeValidator.add(req.body)
  if(validationErrs.length > 0) {
    response.statusBadRequest(res, validationErrs)
    return
  }
  
  try{
    const recipeResponse = await recipeModel.create({
      user: req.userID,
      ...req.body
    })
    response.statusCreated(res, recipeResponse)
  } catch(error){
    response.statusBadGateway(res, [error.message || "some errors occurred when trying to create new recipe"])
  }
}

