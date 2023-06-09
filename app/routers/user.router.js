const express = require("express")
const userController = require("../controllers/user.controller")
const authMiddleware = require("../middlewares/auth.middleware")

module.exports = app => {
  const router = express.Router()
  router.get("/:id/recipes", userController.getUserRecipes)
  router.get("/:id", userController.getUserByID)
  router.patch("", authMiddleware.verifyToken, userController.updateUser)
  router.delete("", authMiddleware.verifyToken, userController.deleteUser)

  app.use("/api/v1/users", router)
}
