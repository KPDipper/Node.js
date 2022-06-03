const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema




const tokenSchema= new mongoose.Schema({

    token:{
        type:String,
        required:true
    },
    userId:{
        type:ObjectId,
        ref:'User',//one to one relationship exist since one user can only have one token
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 86400//time limit for verfification by user//here mongodb ma ni token ko value sab delete  huncha//token empty hunu parcha aster 24 hrs in mongodb

    }

})

module.exports = mongoose.model('Token',tokenSchema)