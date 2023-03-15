const response = require("../models/response.model")
const recipe = require("../models/recipe.model")
const user = require("../models/user.model")

const recipeModel = recipe.model
const recipeValidator = recipe.validator
const userModel = user.model

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

    await userModel.findByIdAndUpdate(req.userID, {
      $push : {
        recipes : recipeResponse._id
      }
    })

    response.statusCreated(res, recipeResponse)
  } catch(error){
    response.statusBadGateway(res, [error.message || "some errors occurred when trying to create new recipe"])
  }
}

exports.getRecipeByID = async (req, res) => {
  try{
    const recipeResponse = await recipeModel.findById(req.params.id).populate("user", ["username","email"])
    if(!recipeResponse){
      response.statusNotFound(res, [`recipe with id ${req.params.id} not found`])
      return
    }

    response.statusOk(res, recipeResponse)
  } catch(error){
    response.statusBadGateway(res, [error.message || "some errors occurred when trying to get recipe"])
  }
}

exports.getRecipes = async (req, res) => {
  try{
    const recipesResponse = await recipeModel.find().populate("user", ["username","email"])
    response.statusOk(res, recipesResponse)
  } catch(error){
    response.statusBadGateway(res, [error.message || "some errors occurred when trying to get recipes"])
  }
}

exports.updateRecipe = async (req, res) => {
  try{
    const foundRecipe = await recipeModel.findById(req.params.id)
    if(!foundRecipe){
      response.statusNotFound(res, [`recipe with id ${req.params.id} not found`])
      return
    }
    
    if(req.userID != foundRecipe.user){
      response.statusForbidden(res, [`you are not allowed to edit this document`])
      return
    }

    const recipeResponse = await recipeModel.findByIdAndUpdate(req.params.id, {$set: req.body}, {new:true})
    response.statusOk(res, recipeResponse)
  } catch(error){
    response.statusBadGateway(res, [error.message || "some errors occurred when trying to update recipes"])
  }
}

exports.deleteRecipe = async (req, res) => {
  try{
    const foundRecipe = await recipeModel.findById(req.params.id)
    if(!foundRecipe){
      response.statusNotFound(res, [`recipe with id ${req.params.id} not found`])
      return
    }
    
    if(req.userID != foundRecipe.user){
      response.statusForbidden(res, [`you are not allowed to edit this document`])
      return
    }

    await recipeModel.findByIdAndDelete(req.params.id)
    response.statusOk(res, `recipe with id ${req.params.id} successfully deleted`)
  } catch(error) {
    response.statusBadGateway(res, [error.message || "some errors occurred when trying to delete recipes"])
  }
}
