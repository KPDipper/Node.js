const express = require('express')////to create express api.express tai hamile index ma import gareko using require('express)
const {addProduct, showProducts, findProduct, updateProduct, deleteProduct, findReleated,filterProduct} = require('../Controller/productController')
const { requireSignin } = require('../Controller/userController')

const upload = require('../middleware/upload')
const { productCheck, newValidation } = require('../Validation/newValidation')
const { productValidation } = require('../Validation/productValidation')
const router= express.Router()//yo tai route define garna ko lagi

router.post('/addproduct',upload.single('product_image'),productCheck,newValidation,addProduct)//yo tai route ma tai euta ni image aune bhyo esari image pass garne
router.get('/showproducts',showProducts)
router.get('/findproduct/:id',findProduct)//here to get single product detail
router.put('/updateproduct/:id',updateProduct)
router.delete('/deleteproduct/:id',deleteProduct)
router.get('/getrelatedproducts/:id',findReleated)
router.post('/getfilteredproducts',filterProduct)

module.exports=router