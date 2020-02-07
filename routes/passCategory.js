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
    var loginUser=localStorage.getItem('userLogin');
    getpasscat.exec(function(err,data){
      if(err) throw err;
      res.render('pass_category', { title: 'Password Managment System' ,loginUser:loginUser ,records:data });
    })
  });

  router.get('/edit/:id',checkuserlogin, function(req, res, next) {
    var loginUser=localStorage.getItem('userLogin');
    var passid =req.params.id.trim();
     var updatepascat=passcateModel.findById({_id:passid});
     updatepascat.exec(function(err,data){
      if(err) throw err;
      res.render('edit_pass_category', { title: 'Password Managment System' 
      ,loginUser:loginUser ,records:data,msg:'',success:'',errors:'',id:passid  });
    });
  });
  ///////////////////////


  function checkaddpassCategory(req,res,next){
    var passcategory=req.body.passcategory;
    var existcategory= passwordModel.findOne({password_category:passcategory});
  existcategory.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('addnewcategory', { title: 'Password Managment System',loginUser:'',success:'',errors:''
      ,records:'' ,msg:'Password Category Already Exist..!'});
    }
    next();
  });
  }
  router.post('/edit/',checkaddpassCategory,checkuserlogin, function(req, res, next) {
    var loginUser=localStorage.getItem('userLogin');
    var passid =req.body.id;
    var getpasscat=req.body.passcategory;
     var updatepascat=passcateModel.findByIdAndUpdate(passid,{password_category:getpasscat});
     updatepascat.exec(function(err,data){
      if(err) throw err;
      res.redirect('/passCategory')
    });
  });
  router.get('/delete/:_id',checkuserlogin, function(req, res, next) {
    var passid =req.params._id;
    passid = passid.trim()
     var deletpascat=passcateModel.findByIdAndDelete({_id: passid});
     deletpascat.exec(function(err,doc){
      if(err){
        throw err;
        return
      }else{
        res.redirect('/passCategory');
      }
    });
  });
  
  module.exports = router;