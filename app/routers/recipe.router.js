
const express = require("express")
const recipeController = require("../controllers/recipe.controller")
const commentController = require("../controllers/comment.controller")
const authMiddleware = require("../middlewares/auth.middleware")

module.exports = app => {
  const router = express.Router()
  router.post("", authMiddleware.verifyToken, recipeController.addRecipe)
  router.get("", recipeController.getRecipes)
  router.get("/:id", recipeController.getRecipeByID)
  router.patch("/:id", authMiddleware.verifyToken, recipeController.updateRecipe)
  router.delete("/:id",authMiddleware.verifyToken, recipeController.deleteRecipe)
  router.post("/:id/images/upload", recipeController.uploadImage)
  router.post("/:id/comment", authMiddleware.verifyToken, commentController.addComment)
  router.patch("/:id/comment/:commentId", authMiddleware.verifyToken, commentController.updateComment)
  router.delete("/:id/comment/:commentId", authMiddleware.verifyToken, commentController.deleteComment)

  app.use("/api/v1/recipes", router)
}
