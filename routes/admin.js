var express = require('express');
const { deletUserDetails, blockUSerDetails } = require('../usersignupdetailsfolder/usersignupdetails');
var router = express.Router();
var loginError = "";
var admin = true;

var userlogindetails = require('../userlogindetailsfolder/userlogindetails')
var usersignupdetails = require('../usersignupdetailsfolder/usersignupdetails');
var adminlogindetails = require('../adminlogindetailsfolder/adminlogindetails');
const { adminLogin } = require('../adminlogindetailsfolder/adminlogindetails');
var user = require('../routes/user');
var adminpasswordError = "";
var adminemailError = "";


const verifyLogin = (req,res,next)=>{
if(req.session.adminloggedIn){
  next()
}
else{

res.redirect('/admin/adminlogin')
}
}





/* GET users listing. */
router.get('/',verifyLogin, function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
usersignupdetails.getUserDetails().then((userdetails)=>{
 
  res.render('admin/adminusers',{admin,userdetails});
})

});


router.get('/adminlogin',(req,res)=>{
  if(req.session.adminloggedIn){
res.redirect('/admin')
  }else{
    res.render('admin/adminlogin',{admin,loginError});
    loginError = "";
  }
 
 
})

router.post('/adminlogin',(req,res)=>{
  adminlogindetails.adminLogin(req.body).then((response)=>{
  
    if(response.ok){
      req.session.adminloggedIn = true;
      req.session.adminuser = req.body.email;
      res.redirect('/admin')
    }
    else{
      loginError = "Inavalid username or password";
      res.redirect('/admin/adminlogin')
    }
  })
})

router.get('/adminlogout',(req,res)=>{
  req.session.adminloggedIn = false;
  req.session.adminuser = null;
  res.redirect('/admin/adminlogin')
})





router.get('/createuser',verifyLogin,(req,res,next)=>{
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.render('admin/createuserpage',{admin,adminpasswordError,adminemailError});
  adminpasswordError = "";
  adminemailError = "";
})

router.post('/createuser',(req,res)=>{
  
  if(req.body.password === req.body.confirmpassword){
    
  userlogindetails.emailcheck(req.body).then((response)=>{
    console.log(response.ok)
    if(response.ok){
      delete req.body.confirmpassword
      usersignupdetails.addUserDetails(req.body).then((response)=>{
        console.log(response)
    res.redirect('/admin/adminlogin')
      });
    }
    else{
      adminemailError = "email is already exist"
      res.redirect('/admin/createuser')
    }
  })
  
   
  }else{
    adminpasswordError = "password is not matching"
  res.redirect('/admin/createuser')
  }
  })
  

// router.get("/block-user",(req,res)=>{
//    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
//  let userId = req.query.id;

//  usersignupdetails.blockUserDetails(userId).then((response)=>{


//    res.redirect('/adminlogout?id=userId')
//  })

//  })












module.exports = router;
