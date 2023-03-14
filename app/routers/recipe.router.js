
const express = require("express")
const recipeController = require("../controllers/recipe.controller")
const authMiddleware = require("../middlewares/auth.middleware")

module.exports = app => {
  const router = express.Router()
  router.post("", authMiddleware.verifyToken, recipeController.addRecipe)

  app.use("/api/v1/recipe", router)
}
