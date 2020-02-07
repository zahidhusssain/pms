const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
mongoose.connect('mongodb://localhost:27017/pms', {useNewUrlParser: true , useCreateIndex:true,});
var conn=mongoose.Collection;
var passSchema= new mongoose.Schema({
password_category:{
    type:String,
    required:true,
    index:{
        unique:true,
    }
},
Project_Name:{
    type:String,
    required:true,
    
},
password_Details:{
    type:String,
    required:true,
},
Date:{
    type:Date,
    default:Date.now,
}
});
passSchema.plugin(mongoosePaginate);
var passwordModel =mongoose.model('password_details',passSchema);
module.exports=passwordModel;

