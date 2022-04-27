const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema; //euta category bitra multiple product hune bhyos

const productSchema = new mongoose.Schema(
  {
    //yo tai database ko table layout  banuna ko lagi ra yesko bitra tai databse ko field haru banauchyoum

    //schema bhaneko table ko structure

    product_name: {
      //yo tai field bhyo
      type: String,
      required: true, //yo tai text hahru khali hunuhuna
      trim: true, //ra kei space cha bhane trim garne
    },
    product_price: {
      type: Number,
      required: true,
      
    },
    product_description: {
      type: String,
      required: true,
      
    },
    product_image: {
      type: String,
      required: true,
    },
    count_in_Stock: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 1,
      max: 5,
    },
    category: {//here this is one to many relationship where one catgory can have multiple product like mobile can have like samsung,google pixel etc
      type: ObjectId,
      required: true,
      ref: "Category",
    },
    review:{
        type:String,
        
    },
  },
  { timestamps: true }
);

//created at
//updated at

module.exports = mongoose.model("Product", productSchema); //category schema tai table ko structure bhyo ra tyo structure ko name tai category bhyo

// product bhaneko tai individual items
//here mobile is categores and samsung mobile is product
//here product le tai jun category stored huncha tyo id le tya bhako id tai aune bhyos
