const mongoose=require('mongoose')

const categorySchema=new mongoose.Schema({//yo tai database ko table layout  banuna ko lagi ra yesko bitra tai databse ko field haru banauchyoum
  //schema bhaneko table ko structure
    
    category_name:{//yo tai field bhyo
        type:String,
        required:true,//yo tai text hahru khali hunuhuna 
        trim:true//ra kei space cha bhane trim garne
    }
},{timestamps:true})
//created at 
//updated at

module.exports=mongoose.model('Category',categorySchema)//category schema tai table ko structure bhyo ra tyo structure ko name tai category bhyo