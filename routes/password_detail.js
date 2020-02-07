var express = require('express');
var router = express.Router();
var bcrypt=require('bcryptjs');
var jwt = require('jsonwebtoken');
var passcateModel=require('../modules/password_category');
var passwordModel=require('../modules/add_password');
var userModel=require('../modules/user');
const { check, validationResult } = require('express-validator');
var getpasscat=passcateModel.find({});
var getAllpassword=passwordModel.find({});
/* GET home page. */
function checkuserlogin (req,res,next){
  var userToken=localStorage.getItem('usertoken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkEmil(req,res,next){
  var email=req.body.email;
  var existemail= userModel.findOne({email:email});
existemail.exec((err,data)=>{
  if(err) throw err;
  if(data){
    return res.render('signup', { title: 'Password Managment System' ,msg:'Email Already Exist..!'});
  }
  next();
});
}
function checkuname(req,res,next){
  var username=req.body.uname;
  var existusername= userModel.findOne({username:username});
  existusername.exec((err,data)=>{
  if(err) throw err;
  if(data){
    return res.render('signup', { title: 'Password Managment System' ,msg:'User Name Already Exist..!'});
  }
  next();
});
}

router.get('/',checkuserlogin, function(req, res, next) {
    res.redirect('/dashboard');
  });
  
  router.get('/delete/:id',checkuserlogin, function(req, res, next) {
    var loginUser=localStorage.getItem('userLogin');
    var id=req.params.id;
    var deletepassmodel=passwordModel.findByIdAndDelete(id);
    deletepassmodel.exec(function(err){
      if(err) throw err;
      getAllpassword.exec(function(err,data){
        if(err) throw err;
        res.render('view-all-password', { title: 'Password Managment System',loginUser:loginUser ,records:data });
      })
    })
  });
  router.get('/edit/:id',checkuserlogin, function(req, res, next) {
    var loginUser=localStorage.getItem('userLogin');
    var id= req.params.id;
    var getpassdetail=passwordModel.findById({_id:id});
    getpassdetail.exec(function(err,data){
      if(err) throw err;
      getpasscat.exec(function(err,data1){
      res.render('edit_password_detail', { title: 'Password Managment System',loginUser:loginUser ,
      success:'',record:data ,records:data1});
      })
    })
  });
  router.post('/edit/:id',checkuserlogin, function(req, res, next) {
    var loginUser=localStorage.getItem('userLogin');
    var id= req.params.id;
    var passcate=req.body.password_category;
    var project_name=req.body.project_name;
    var password_detail=req.body.password_detail;
  
    passwordModel.findByIdAndUpdate(id,{password_category:passcate,
      Project_Name:project_name,password_Details:password_detail})
    .exec(function(err){
        if(err) throw err;
        var getpassdetail=passwordModel.findById({_id:id});
    getpassdetail.exec(function(err,data){
      if(err) throw err;
      getpasscat.exec(function(err,data1){
      res.render('edit_password_detail', { title: 'Password Managment System',loginUser:loginUser ,
      success:'Record Updated Successfully..!!',record:data ,records:data1});
      })
    })
     
  });
    
  });
  
  
  module.exports = router;