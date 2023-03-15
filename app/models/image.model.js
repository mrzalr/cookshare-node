const mongoose = require("mongoose")

const imageSchema = mongoose.Schema({
  url : {
    type : String,
    required : true
  },
  recipe : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Recipe"
  },
  isThumbnail : {
    type : Boolean,
    default : false
  }
}
, { timestamps : true })

imageSchema.method("toJSON", function(){
  const {__v, _id, ...object} = this.toObject()
  return { id : _id, ...object}
})

module.exports = {
  model : mongoose.model("Image", imageSchema),
}
