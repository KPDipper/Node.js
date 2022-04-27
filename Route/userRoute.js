const express = require('express')
const { addUser, userSign, userSignout, verifyUser, resendVerification, forgetPassword, resetPassword, userList, findUser, requireSignin } = require('../Controller/userController')
const { userCheck, newValidation } = require('../Validation/newValidation')
// const sendEmail = require('../utils/setEmails')
const { userValidation } = require('../Validation/userValidation')
const router = express.Router()

router.post('/adduser',userCheck,newValidation,addUser)//email pahuna ko lagi send email chaincha for verfication
router.post('/signin',userSign)
router.get('/signout',userSignout)
router.post('/confirmation/:token',verifyUser)//yo tai verifyuser ko format since token ko url ra datbase ko url compare garne
router.post('/resendverification',resendVerification)//user bata email linu parcha for re send so use post method
router.post('/forgetpassword',forgetPassword)//
router.post('/resetpassword/:token',resetPassword)
router.get('/userlist',requireSignin,userList)
router.get('/finduser/:userid',requireSignin,findUser)//hamile url bata taneko bhayera hamile get method userako edi body bata taneko bhaye post method hunthyo


module.exports = router


//update garda keri put garne
