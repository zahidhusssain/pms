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
    res.render('addnewcategory', { title: 'Password Managment System',loginUser:loginUser,errors:'' ,success:'',msg:'' });
  });
  
router.post('/',checkuserlogin,checkaddpassCategory,[check('passcategory','Enter Password Category Name').isLength({ min: 1 })], function(req, res, next) {
    var loginUser=localStorage.getItem('userLogin');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('addnewcategory', { title: 'Password Managment System',loginUser:loginUser,
      errors:errors.mapped(),success:'',msg:'' });
    }
    else{
  var passCatename=req.body.passcategory;
  var passcteDetails= new passcateModel({
    password_category:passCatename,
  });
  passcteDetails.save(function(err,data){
    if(err) throw err;
    res.render('addnewcategory', { title: 'Password Managment System',loginUser:loginUser,msg:'',errors:'' 
    ,success:'Password Category Inserted successfully..!!' });
  })
    }
  });
  //////////////////////////meddileware/////
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

module.exports = router;
