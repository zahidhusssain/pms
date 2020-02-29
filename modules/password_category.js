const mongoose = require('mongoose');
//mongodb+srv://pms:<password>@pms-pamze.mongodb.net/test
//mongodb://localhost:27017/pms
mongoose.connect('mongodb+srv://pms:<password>@pms-pamze.mongodb.net/test', {useNewUrlParser: true , useCreateIndex:true,});
var conn=mongoose.Collection;
var passcatSchema= new mongoose.Schema({
    
    
password_category:{
    type:String,
    required:true,
    index:{
        unique:true,
    }
},

Date:{
    type:Date,
    default:Date.now,
}
});


var passcateModel =mongoose.model('password_categories',passcatSchema);
module.exports=passcateModel;

