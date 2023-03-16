const mongoose = require("mongoose")

const commentSchema = mongoose.Schema({
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  },
  recipe : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Recipe"
  },
  content : {
    type : String,
    required : true
  }
}
, { timestamps : true })

commentSchema.method("toJSON", function(){
  const {__v, _id, ...object} = this.toObject()
  return { id : _id, ...object}
})

const add = body => {
  const validationErrs = []
  if(body.content === undefined || body.content === ""){
    validationErrs.push("content should not be empty")
  }

  return validationErrs
}


module.exports = {
  model : mongoose.model("Comment", commentSchema),
  validator : {
    add
  }
}
