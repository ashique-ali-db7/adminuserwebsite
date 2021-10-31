var db = require('../config/connection');
var collections = require('../config/collection')
var bcryptjs = require('bcryptjs');
var objectId = require('mongodb').ObjectId;
const { response } = require('express');
var userlogindetails = require('../userlogindetailsfolder/userlogindetails');
module.exports = {
    addUserDetails:(userdetails)=>{
     return new Promise(async(resolve,reject)=>{
userdetails.password = await bcryptjs.hash(userdetails.password,10) 
         db.get().collection(collections.USER_DETAILS_COLLECTION).insertOne(userdetails).then((data)=>{
             resolve(data.insertedId)
         })
     })

    },
    getUserDetails:()=>{
        return new Promise(async(resolve,reject)=>{
            let userDetails =await db.get().collection(collections.USER_DETAILS_COLLECTION).find().toArray()//for converting all this to array
            resolve(userDetails);
        })

    },
deletUserDetails:(deleteemail)=>{
return new Promise((resolve,reject)=>{
 db.get().collection(collections.USER_DETAILS_COLLECTION).deleteOne({email:deleteemail}).then((response)=>{
    resolve(response);
 })

})
},
blockUserDetails:(unblockemail)=>{
return new Promise((resolve,reject)=>{
    db.get().collection(collections.USER_DETAILS_COLLECTION).updateOne({email:unblockemail},{$set:{blocked:true}}).then((response)=>{
        
        resolve(response);
    })
})
},
unblockUserDetails:(unblockemail)=>{
return new Promise((resolve,reject)=>{
    db.get().collection(collections.USER_DETAILS_COLLECTION).updateOne({email:unblockemail},{$unset:{blocked:true}}).then((response)=>{
        resolve(response);
    })
})
}


}