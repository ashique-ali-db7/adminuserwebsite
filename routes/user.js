var express = require('express');
var router = express.Router();
var usersignupdetails = require('../usersignupdetailsfolder/usersignupdetails');
var userlogindetails = require('../userlogindetailsfolder/userlogindetails');
const { response } = require('express');
var admin = require('../routes/admin');
const adminlogindetails = require('../adminlogindetailsfolder/adminlogindetails');


var loginError = "";
var loginBlocked = "";
var passwordError = "";
var emailError = "";


// middleware
const verifyLogin = (req,res,next) =>{
  if(req.session.user){
   userlogindetails.Blockedornot(req.session.user.email).then((user)=>{
     
     if('blocked' in user){
      res.redirect('/login')
     }
     else{
      if(user.email === req.session.user.email){
        next()
      }else{
        res.redirect('/login')
      }
      
     }
   }) 
  }else{
    res.redirect('/login')
   }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  
    res.redirect('/home')
  
 ;
});

router.get('/login',function(req,res){
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render('login',{login:true,loginError,loginBlocked})
    loginError = "";
    loginBlocked = "";
})

router.post('/login',(req,res)=>{
  
  console.log("hidb")
  userlogindetails.checkLogin(req.body).then((response)=>{
     if(response.blocked){
 loginBlocked = " You are blocked";
 res.redirect('/login')
     }
    
else if(response.status){
  req.session.loggedIn = true;
  
  req.session.user = response.user;
  console.log(req.session.user.email)
  res.redirect('/')
}else{
  loginError = "Inavalid username or password";
res.redirect('/login')
}
  })
   
    
})


router.get('/home',verifyLogin,(req,res)=>{
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  console.log("hi kallan");
  if(req.session.loggedIn === true){
  let user = req.session.user;

  let products = [
    {
      img:"data:image/jpeg;base64,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"
      ,
      tittle:"adiddas 2X",
      description:"Some quick example text to build on the card title and make up the bulk of the card's content."
    },
    {
      img:"data:image/jpeg;base64,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"
      ,
      tittle:"adiddas blade",
      description:"Some quick example text to build on the card title and make up the bulk of the card's content."
    }
    
    ]


  res.render('index', { userhome:true,products,user});
}
else{
  res.redirect('/login')
}

})


router.get('/usersignup',(req,res)=>{
 
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    console.log(passwordError)
     res.render('user-create-user-page',{usersignup:true,passwordError,emailError})
     passwordError="";
     emailError = "";
 
 
});


router.post('/createuser',(req,res)=>{
  
if(req.body.password === req.body.confirmpassword){
  
userlogindetails.emailcheck(req.body).then((response)=>{
  console.log(response.ok)
  if(response.ok){
    delete req.body.confirmpassword
    usersignupdetails.addUserDetails(req.body).then((response)=>{
      console.log(response)
  res.redirect('/login')
    });
  }
  else{
    emailError = "email is already exist"
    res.redirect('/usersignup')
  }
})

 
}else{
passwordError = "password is not matching"
res.redirect('/usersignup')
}
})


router.get('/logout',(req,res)=>{
  req.session.loggedIn = false
  req.session.user = "";
  res.redirect('/login')

})


// router.get("/block-user",(req,res)=>{
//   res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
//  useremail = req.query.email;

// usersignupdetails.blockUserDetails(useremail).then((response)=>{


//   res.redirect('/adminlogout')
// })

// })


router.get("/unblock-user",(req,res)=>{
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  let useremail = req.query.email;
 
  usersignupdetails.unblockUserDetails(useremail).then((response)=>{
res.redirect('/admin');
  })
});


router.get("/delete-user",(req,res)=>{

  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
let useremail = req.query.email;
usersignupdetails.deletUserDetails(useremail).then((response)=>{
  
  if(req.session.user?.email == useremail){
    console.log("ok aanalo")
    req.session.user = "";
    req.session.loggedIn = false;
       res.redirect('/admin/')
   }
   else{
    res.redirect('/admin/')  
   }
  
 

  
})
});






 router.get('/block-user',(req,res)=>{
   
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  useremail = req.query.email;
 
 usersignupdetails.blockUserDetails(useremail).then((response)=>{
 
  
  
  if(req.session.user?.email == useremail){
  
    console.log("ok aanalo")
  req.session.loggedIn = false;
    req.session.user = "";
       res.redirect('/admin/')
   }
   else{
    res.redirect('/admin/')
   } 
 })
})

router.get('/edit-user',async(req,res)=>{
  let useremail = req.query.email;
let usersdetails =await adminlogindetails.getedituser(useremail).then((userdata)=>{
let admin = true;
res.render('admin/adminedit',{userdata,admin});
})


})

router.post('/edit-user',(req,res)=>{
  let useremail = req.query.email;
  adminlogindetails.updateedit(useremail,req.body).then(()=>{
    res.redirect('/admin/');
  })
})







module.exports = router;
