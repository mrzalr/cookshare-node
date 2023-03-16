const fs = require("fs")

const response = require("../models/response.model")
const image = require("../models/image.model")
const recipe = require("../models/recipe.model")

const imageModel = image.model
const recipeModel = recipe.model

exports.uploadImage = async (req, res) => {
  if(!req.file) {
    response.statusUnprocessable(res, "image should not be empty")
    return
  }

  try{
    const foundRecipe = await recipeModel.findById(req.params.id)
    if(!foundRecipe){
      response.statusNotFound(res, `recipe with id ${req.params.id} not found`)
      return
    }

    if(req.userID != foundRecipe.user){
      response.statusForbidden(res, [`you are not allowed to edit this document`])
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

exports.deleteImage = async (req, res) => {
  try{
    const foundRecipe = await recipeModel.findById(req.params.id)
    if(!foundRecipe){
      response.statusNotFound(res, `recipe with id ${req.params.id} not found`)
      return
    }

    if(req.userID != foundRecipe.user){
      response.statusForbidden(res, [`you are not allowed to edit this document`])
      return
    }

    const foundImage = await imageModel.findById(req.params.imageId)
    if(!foundImage){
      response.statusNotFound(res, `image with id ${req.params.imageId} not found`)
      return
    }

    await imageModel.findByIdAndDelete(req.params.imageId)
    fs.unlink(`./${foundImage.url}`, (err) => {
      if(err) throw err
    })

    const recipeResponse = await recipeModel.findByIdAndUpdate(req.params.id, {
      $pull : {
        images : req.params.imageId
      }
    }, {new: true})

    response.statusOk(res, recipeResponse)
  } catch(error){
    response.statusBadGateway(res, [error.message || "some errors occurred when trying to delete image"])
  }
}
