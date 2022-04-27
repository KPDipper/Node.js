//produts information,user ko information(login in),total price,shipping address,phone numbers,total stock


//orderitems:kun tai prdouct ho ra kati quantity cha(name,price in product) kati kwota order garne tai quantity ho 
// hamile phone 1 id1 item 1,
//  mobile 2 id2 item 2
//  yesari stored huncha order ma then we stored as that in orderitems


//order: [orderitems] koarray ,user-info, shipping address
// aabha yesma [item1,item2,...] yesrai stored huncha


//to store orders of a customer

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const OrderSchema = new mongoose.Schema({
 
        //here euta order ma multple orderitems(mobile,laptop) huna sakcha

    OrderItems: [{//since its in array yo big bracket ma 
        type:ObjectId,
        ref:"OrderItem",
        required:true,

    }],
    user:{//kasle order garne yeta aucha

        type:ObjectId,
        ref:"User",//we use order from another model
        required:"true"
    },

    shippingAddress:{//kata pathune bhanera address
        type:String,
        required:true
    },

    shippingAddress2:{//optional if adress 1 doesn't exist
        type:String,
        
    },
    phone:{
        type:Number,
        required:true
    },
    status:{
        type:String, 
        default:"pending",
        required:true,
    },
    totalPrice:{
        type:Number,
        required:true
    }

},{timestamps:true})

module.exports= mongoose.model('Order',OrderSchema)






