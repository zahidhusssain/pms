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
router.get('/', function(req, res, next) {
  var userlogin=localStorage.getItem('userLogin')
  if(userlogin){
    res.redirect('./dashboard');
  }
  else{
   
  res.render('index', { title: 'Password Managment System',msg:'' });
  }
});
router.post('/', function(req, res, next) {
  var username=req.body.uname;
  var password=req.body.password;
  var checkUser=userModel.findOne({username:username});
  checkUser.exec((err,data)=>{
    if(err){ throw err;}
    else{
    var getuserID=data._id;
    var getpassword=data.password;
    if(bcrypt.compareSync(password,getpassword)){
      var token = jwt.sign({ userid: getuserID }, 'loginToken')
      localStorage.setItem('usertoken', token);
      localStorage.setItem('userLogin', username);

      res.redirect('/dashboard');
    }else{
      res.render('index', { title: 'Password Managment System',msg:'Invalid User Name or Password .!!' });
    }
  }
  })
  
});

router.get('/signup', function(req, res, next) {
  var userlogin=localStorage.getItem('userLogin')
  if(userlogin){
    res.redirect('./dashboard');
  }
  else{
  
  res.render('signup', { title: 'Password Management System' ,msg:'',errors:''});
  }
});
router.post('/signup',checkuname,checkEmil,[check('password',' Password is less then 8 digit').isLength({ min: 8 })], function(req, res, next) {
  const errors = validationResult(req);
  
  var username=req.body.uname;
  var email=req.body.email;
  var password=req.body.password;
  var confirmpassword=req.body.confirmpassword;
  if (!errors.isEmpty()) {
   
    res.render('signup', { title: 'Password Management System',msg:'Confirmpassword not Match with Password ..!',errors:errors.mapped() });
  }
  if(password != confirmpassword){
    res.render('signup', { title: 'Password Management System',msg:'Confirmpassword not Match with Password ..!',errors:'' });
  }
  else{
    password=bcrypt.hashSync(req.body.password,11);
  var userDetail=new userModel({
    username:username,
    email:email,
    password:password,
  });
  userDetail.save((err,doc)=>{
  if(err) throw err;
  res.render('signup', { title: 'Password Management System',msg:'User Registered Successfully',errors:'' });
});
  }
  });
  
  

/*
router.get('/viewallpassword',checkuserlogin, function(req, res, next) {
  var loginUser=localStorage.getItem('userLogin');
  getAllpassword.exec(function(err,data){
    if(err) throw err;
    res.render('view-all-password', { title: 'Password Managment System',loginUser:loginUser,pages:'' ,records:data });
  })
});*/
//////////////////////////Pagination/////////////

router.get('/home', function(req, res, next) {
  res.render('home',{
    title: 'Home'
  });
});
router.get('/logout', function(req, res, next) {
 localStorage.removeItem('usertoken');
 localStorage.removeItem('userLogin');
 res.redirect('/');
});
module.exports = router;
