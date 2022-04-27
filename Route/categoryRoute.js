const express = require('express')////to create express api.express tai hamile index ma import gareko using require('express)
const { addCategory, showCategories, findCategory, updateCategory, deleteCategory } = require('../Controller/categoryController')
const { requireSignin } = require('../Controller/userController')
const { categoryCheck, newValidation } = require('../Validation/newValidation')
const { categoryValidation } = require('../validation/productValidation')
// const { showInfo, showMessage } = require('../Controller/categoryController')


const router= express.Router()//yo tai route define garna ko lagi


//  router.get('/',showInfo)//yo tai hamile function call garcya so hamile function index ma banunu ko sato like we did it upper code
// // //hamile yesari call garna pauchyou

//  router.get('/next',showMessage)

//get tai value read garna ko lagi ho
router.post('/addcategory',requireSignin,categoryCheck,newValidation,addCategory)//post tai value save ra send garna ko lagi ho
//here categoryValidation le tai not empty check garne that means add garda kheri yedi hamile empty value pathyoum bhane error handling garnu parcha
router.get('/categories',showCategories)//here yo sabai read gari racha so no need for body parser
//since maile agi addcategory ma postman ma gaeyra value send gare 3 choti
//now showcategories ko url halera send gare bhane malaia abha 3 wota json format ma category_name dekhucha 
router.get('/findcategory/:id',findCategory)

router.put('/updatecategory/:id',requireSignin,categoryCheck,newValidation,updateCategory)
router.delete('/deletecategory/:id',requireSignin,deleteCategory)
module.exports=router//to return the functions

//export default lidena express js ma 
//put bhaneko update garna ko lagi ho