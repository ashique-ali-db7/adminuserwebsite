var db = require('../config/connection');
var collections = require('../config/collection');
var objectId = require('mongodb').ObjectId;
var bcryptjs = require('bcryptjs');


module.exports={
checkLogin:(userData)=>{
    return new Promise(async(resolve,reject)=>{
        let loginStatus = false;
     let response = {}


        let user = await db.get().collection(collections.USER_DETAILS_COLLECTION).findOne({email:userData.email})
       
        

        if(user){
            let userBlocked = await db.get().collection(collections.USER_DETAILS_COLLECTION).findOne({_id:objectId(user._id)},{'blocked':true})
  bcryptjs.compare(userData.password,user.password).then((status)=>{


      if(status){
          if(userBlocked.blocked){
response.blocked = true
resolve(response);
          }else{

        
          console.log("status");
          response.user = user;
          response.status = true;
          resolve(response)
          }
      }else{
          response.emailnotok = true
          console.log("login failed");
          resolve({status:false});
      }
    
  })
        }else{
            resolve({status:false});
            console.log("login failed")
        }
    
    })
},
emailcheck:(data)=>{
    
    return new Promise(async(resolve,reject)=>{
        console.log(data.email);
let user = await db.get().collection(collections.USER_DETAILS_COLLECTION).findOne({email:data.email});
let result = {}  
if(user){
    console.log("shashi")
    result.ok = false
    resolve(result)
   
  }  
  else{
    result.ok = true
    resolve(result)

    
  }
})
},


Blockedornot:(email)=>{
return new Promise(async(resolve,reject)=>{
    await db.get().collection(collections.USER_DETAILS_COLLECTION).findOne({email:email},{'blocked':true}).then((user)=>{
        resolve(user);
    })
    
   
})
},






}