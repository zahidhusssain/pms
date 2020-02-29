const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://pms:<password>@pms-pamze.mongodb.net/test', {useNewUrlParser: true , useCreateIndex:true,});
var conn=mongoose.Collection;
var userSchema= new mongoose.Schema({
    
username:{
    type:String,
    required:true,
    index:{
        unique:true,
    }
},
email:{
    type:String,
    required:true,
    index:{
        unique:true,
    }
},
password:{
    type:String,
    required:true,
    
},
Date:{
    type:Date,
    default:Date.now,
}
});


var userModel =mongoose.model('users',userSchema);
module.exports=userModel;

