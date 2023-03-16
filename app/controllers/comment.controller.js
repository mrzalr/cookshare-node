const comment = require("../models/comment.model")
const response = require("../models/response.model")
const recipe = require("../models/recipe.model")

const commentModel = comment.model
const commentValidator = comment.validator
const recipeModel = recipe.model

exports.addComment = async (req, res) => {
  const validationErrs = commentValidator.add(req.body)
  if(validationErrs.length > 0){
    response.statusBadRequest(res, validationErrs)
    return
  }

  try {
    const commentResponse = await commentModel.create({
      user : req.userID,
      recipe : req.params.id,
      content : req.body.content
    })

    await recipeModel.findByIdAndUpdate(req.params.id, {
      $push : {
        comments : commentResponse._id
      }
    })

   response.statusCreated(res, commentResponse)
  } catch(error){
    response.statusBadGateway(res, [error.message || "some errors occurred when trying to create new comment"])
  }
}

exports.updateComment = async (req, res) => {
  try {
    const foundComment = await commentModel.findById(req.params.commentId)
    if(!foundComment){
      response.statusNotFound(res, [`comment with id ${req.params.commentId} not found`])
    }

    if(req.userID != foundComment.user){
      response.statusForbidden(res, [`you are not allowed to edit this document`])
      return
    }

    const commentResponse = await commentModel.findByIdAndUpdate(req.params.commentId, { $set : req.body }, { new : true })

    response.statusOk(res, commentResponse)
  } catch (error){
    response.statusBadGateway(res, [error.message || "some errors occurred when trying to update comment"])
  }
}

exports.deleteComment = async (req, res) => {
  try {
    const foundComment = await commentModel.findById(req.params.commentId)
    if(!foundComment){
      response.statusNotFound(res, [`comment with id ${req.params.commentId} not found`])
    }

    const foundRecipe = await recipeModel.findById(req.params.id)

    if(req.userID != foundComment.user && req.userID != foundRecipe.user){
      response.statusForbidden(res, [`you are not allowed to edit this document`])
      return
    }

    await commentModel.findByIdAndDelete(req.params.commentId)
    response.statusOk(res, `comment with id ${req.params.commentId} successfully deleted`)
  } catch(error){
    response.statusBadGateway(res, [error.message || "some errors occurred when trying to delete comment"])
  }
}
