const express = require("express")
const userController = require("../controllers/user.controller")

module.exports = app => {
  const router = express.Router()
  router.post("/register", userController.createUser)

  app.use("/api/v1/auth", router)
}
