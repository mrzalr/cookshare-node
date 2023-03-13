const jwt = require("jsonwebtoken")
const response = require("../models/response.model")

exports.verifyToken = (req, res, next) => {
    const authorization = req.get("Authorization")
    if(!authorization){
        response.statusUnauthorized(res, ["Token is empty"])
        return
    }

    const token = authorization.split(" ")
    if(token[0] !== "Bearer" || !token[1]) {
        response.statusUnauthorized(res, ["Token format isn't valid | expected token format : Bearer tokentokentoken"])
        return
    }

    jwt.verify(
        token[1],
        process.env.JWT_SECRETKEY,
        (error, payload) => {
            if(error) {
                response.statusUnauthorized(res, [error.message || "some errors occurred when trying to verify token"])
            }
            req.userID = payload.userID
            next()
        }
    )
}