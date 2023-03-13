const db = {}

db.mongoose = require("mongoose")
db.UserModel = require("./user.model")(db.mongoose)

module.exports = db
