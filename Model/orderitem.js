const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderItemSchema = new mongoose.Schema({
    //here yesma orderitems tai product bata aune ho//yesma one to one relationship exist garcha since one orderitem can store one product
  product:{
    type: ObjectId,
    ref: "Product",//ref le tai product table bhanera chinayoucha
    required: true,
  },
  quantity: {//euta shirt kati wota kina paincha like malai 3 ta kina payio bhane 3ta quantity hune bhyo
    type: Number,
    required: true,
  }
},{timestamps:true});

module.exports = mongoose.model('OrderItem',orderItemSchema)//OrderItem is model