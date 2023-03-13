const express = require("express")
const userController = require("../controllers/user.controller")

module.exports = app => {
  const router = express.Router()
  router.post("/register", userController.register)
  router.post("/login", userController.login)

  app.use("/api/v1/auth", router)
}
