
const express = require("express")
const recipeController = require("../controllers/recipe.controller")
const authMiddleware = require("../middlewares/auth.middleware")

module.exports = app => {
  const router = express.Router()
  router.post("", authMiddleware.verifyToken, recipeController.addRecipe)
  router.get("", recipeController.getRecipes)
  router.get("/:id", recipeController.getRecipeByID)
  router.patch("/:id", authMiddleware.verifyToken, recipeController.updateRecipe)
  router.delete("/:id",authMiddleware.verifyToken, recipeController.deleteRecipe)
  router.post("/:id/images/upload", recipeController.uploadImage)

  app.use("/api/v1/recipes", router)
}
