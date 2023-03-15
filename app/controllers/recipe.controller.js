const response = require("../models/response.model")
const recipe = require("../models/recipe.model")
const user = require("../models/user.model")
const image = require("../models/image.model")

const recipeModel = recipe.model
const recipeValidator = recipe.validator
const userModel = user.model
const imageModel = image.model

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
    const recipeResponse = await recipeModel.findById(req.params.id).populate("user", ["username","email"]).populate("images",["url", "isThumbnail"])
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
    const recipesResponse = await recipeModel.find().populate("user", ["username","email"]).populate("images",["url", "isThumbnail"])
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

exports.uploadImage = async (req, res) => {
  if(!req.file) {
    response.statusUnprocessable(res, "image should not be empty")
    return
  }

  try{
    const foundRecipes = await recipeModel.findById(req.params.id)
    if(!foundRecipes){
      response.statusNotFound(res, `recipe with id ${req.params.id} not found`)
      return
    }

    const imageResponse = await imageModel.create({
      url : req.file.path,
      recipe : req.params.id,
      isThumbnail : req.body.isThumbnail,
    })

    const recipeResponse = await recipeModel.findByIdAndUpdate(req.params.id, {
      $push : {
        images : imageResponse._id
      }
    }, {new: true})

    response.statusOk(res, recipeResponse)
  } catch(error){
    response.statusBadGateway(res, [error.message || "some errors occurred when trying to upload image"])
  }
}
