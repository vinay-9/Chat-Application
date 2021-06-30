const mongoose= require('mongoose');
const PostSchema= mongoose.Schema({
   name:{type:String, required:true},
   message:{type:String,required:true},
   room:{type:String,required:true},
   time:{type:String,required:true}
});
 module.exports=mongoose.model("Post",PostSchema);