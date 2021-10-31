var db = require('../config/connection');
var collections = require('../config/collection')
var bcryptjs = require('bcryptjs');
var objectId = require('mongodb').ObjectId;
const express = require('express');
const { response } = require('express');
const e = require('express');

module.exports = {

adminLogin:(adminData)=>{
return new Promise(async(resolve,reject)=>{
  let  result = {}
    
 let user = await db.get().collection(collections.ADMIN_DETAILS_COLLECTION).findOne({email:adminData.email,password:adminData.password});

       if(user){
           result.ok = true;
           resolve(result);
       }
       else{
           result.ok = false;
           resolve(result);
       }


})
 

},
getedituser:(data)=>{
return new Promise(async(resolve,reject)=>{
db.get().collection(collections.USER_DETAILS_COLLECTION).findOne({email:data}).then((result)=>{
    resolve(result)
})

})

},
updateedit:(email,updatedata)=>{
return new Promise((resolve,reject)=>{
    db.get().collection(collections.USER_DETAILS_COLLECTION).updateOne({email:email},{
        $set:{firstname:updatedata.firstname,lastname:updatedata.lastname}}).then((data)=>{
            console.log(data)
            resolve()
        })
})

}





}
