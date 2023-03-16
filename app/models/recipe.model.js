const mongoose = require("mongoose")

const recipeSchema = mongoose.Schema({
  title : {
    type : String,
    required : true,
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  },
  images : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Image"
    }
  ],
  portion : {
    type : Number,
    required : true,
    default : 1,
  },
  cookingTime : {
    type : Number,
    required : true,
    default : 30,
  },
  description : {
    type : String,
    required : true,
    default: "no description",
  },
  ingredients : {
    type : String,
    required : true,
  },
  instructions : {
    type : String,
    required : true,
  },
  tags : {
    type : String,
  },
  comments : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Comment"
  }]
}, { timestamps : true })

recipeSchema.method("toJSON", function(){
  const {__v, _id, ...object} = this.toObject()
  return { id : _id, ...object}
})

const add = body => {
  const validationErrs = []
  if(body.title === undefined || body.title === ""){
    validationErrs.push("title should not be empty")
  }
  if(body.ingredients === undefined || body.ingredients === ""){
    validationErrs.push("ingredients should not be empty")
  }
  if(body.instructions === undefined || body.instructions === ""){
    validationErrs.push("instructions should not be empty")
  }

  return validationErrs
}

module.exports = {
  model : mongoose.model("Recipe", recipeSchema),
  validator : {
    add,
  }
}
