const express = require('express')
const { placeOrder, viewOrderList, orderDetail, userOrder, updateOrder, deleteOrder } = require('../Controller/orderController')
const router = express.Router()

router.post('/postorder',placeOrder)
router.get('/vieworderlist',viewOrderList)
router.get('/orderdetail/:id',orderDetail)//since single item herna ko lagi harek ko different url huncha so hamiel id use gareko
//yo id tai hamile orderlist ma jun id huncha suru ma tyo id use garne
//chuta chuta product ko description chuta chuta aucha
router.get('/userorder/:userid',userOrder)
router.put('/updateorder/:orderid',updateOrder)
router.delete('/deleteOrder/:orderid', deleteOrder)



module.exports = router