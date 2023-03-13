module.exports = mongoose => {
  const UserSchema = mongoose.Schema({
    username : {
      type : String,
      required : true
    },
    email : {
      type : String,
      required : true
    },
    password : {
      type : String,
      required : true
    }
  }, { timestamps : true })

  return mongoose.model("user", UserSchema)
}
