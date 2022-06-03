const express =require('express')
const { sendStripeKey, processPayment } = require('../Controller/paymentController')

const router=express.Router()

router.post('/processpayment',processPayment)
router.get('/stripeapi',sendStripeKey)

module.exports=router