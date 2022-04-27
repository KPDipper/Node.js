// exports.showInfo=(req,res)=>{

//     res.send("Message from controller")

// }

// exports.showMessage=(req,res)=>{//here exports le tai showMessage ma index.js lai return garcha
//     res.send("This is another message from controller")
// }

// // export tai index ma return garna lagi
// //showinfo tai function ko name jo hamile index.js return garchyoum

//yedi hamile category ma model bhanyoum re cart ko jasma hamile binna bina item haru halyoum bhane teslai yedi update ,add remove items haru garnu cha bahne
//

const Category = require("../Model/category"); //yo tai hamile category js bata import gareko yeta//model lai tai hamile controller lai import garya ho hamile so we can now apply certain functions
//hmaile jaile ni table structure import garnu parcha categoryController ma so we can use it to add delete or other
//model ko name capital hunu parcha
exports.addCategory = async (req, res) => {
  //yo tai request server lai ayepachi hune kam ho
  let category = new Category(req.body); //naya object bhyo category tai.we are creating the object of table structure or schema
  //req.body form bata jun input aucha ni value to tai req.body bhyo//jaba form bata alueu aucha then body bata aucha
  //yo tai user bata aune data haru ho//kiurl bata aune which is parents
  Category.findOne(
    { category_name: category.category_name },
    async (error, data) => {
      //findone le specfic character kocha .category_name:category.category_names yo bhane eko compare garna ko lagi ko so category_name tai table ma bhayeko column ko name ow category.category_name tai mathi bata ako ho
      if (data == null) {
        //yedi tyo table already tyo category exist gardena bhane yo kam huncha

        category = await category.save(); //yo tai table ma data entry garna ko lagi and to save//input bhakeo data save garna ko lagi
        //jaba samma category.save() complet hudena yo purai aru function haru wait garera basnu parcha that is a job of wait/async
        //async await le garda data fetch huncha so go to postman
        //here save garda keri database sanga connect garnu parcha tesaile yesmai hamile await garnu parcha
        //postman yedi check garna man cha bhane jaile json format ma garne
        //create new url then go to body and click raw and type the below code
        //  eg:
        //  {
        //     "category_name":"Mobile"
        // }

        if (!category) {
          //yedi category ma kei value chaina bhane//if category is null

          return res.status(400).json({ error: "something went wrong" }); //here mongodob ma output jaile json data ma hunuparcha
        } else {
          res.send(category); //if there is value in category then send the value of category to categoryRoute.js ma
        }
      } else return res.status(400).json({ error: "Categories already exist" }); //yedi category cha bhane already error aucha
    }
  );
};

exports.showCategories = async (req, res) => {
  let categories = await Category.find(); //category table ma bhayeko sabai data ma tai category ma gayera rakcha.find le sabai return garcha//yesle sbaia bhae barko category dekhaucha like mobile laptop etc
  if (!categories) {
    return res.status.json({ error: "something went wrong" });
  } else {
    res.send(categories);
  }
};


//to show only one category

exports.findCategory = async(req, res)=>{

    // let category = await Category.findOne({__id:req.params.id})//yesle object lincha
    let category = await Category.findById(req.params.id)//finfby id ma tai object banunu pardena

    if(!category){//here yedi spescific value return bhayena bhane category ma then !category ko ma jancha ra error aucha
        return res.status(400).json({ error: "something went wrong" });
    }
    else{
        res.send(category)
    }
}


//to update category:suppost mali mobile dekhi laptop banuna man chahane use huncha

exports.updateCategory =async (req,res)=>{
  let category = await Category.findByIdAndUpdate(//findbyidupdate le id lincha ra teslai update garcha
    req.params.id,//yo url bata aune value ho eslai update
    {
        category_name : req.body.category_name//yo tai kun value halne bhanera jun tyo value update bhayera jancha
    },
    {new:true}//jun value update bhcha tyo value tai dkehuna parcha tesko lagi {new: true }use huncha//use it for display
    )
    if(!category){
        return res.status(400).json({error:"something went wrong"})
    }
    else{
        res.send(category)
    } 
}
//here updata garna
//value haru pathaunu cha bahne matra req.body chaincha


//to delte category
exports.deleteCategory= (req,res)=>{
  let category =  Category.findByIdAndRemove(req.params.id)//yo tai kun chai category delete garne hamile id pathako
  //category ma tai abha delete bhayera response aucha ra category ma bascha
  .then(category=>{//yedi database sanga connect bhyo bhane matra ho
    if(!category){
      return res.status(400).json({error :"category not found"})//yedi category khali ayo bhane which means response yedi kei ayena bhane response yesto aucha.
      //if id ko fromat milena bhane yo error aucha
    }
    else{//yedi database sanga connect bhayo ra fromat milyo bhane yo resonse aucha
      return res.status(200).json({msg :"category deleted successfully"})//yedi category

    }}
  )
  .catch(error=>res.status(400).json({error: error}))//yedi database sanga connect garna sakena bhane yo huncha


}


//req.params le url bata value  lincha
//yo id ma tai value bascha so hamile specfic category matra lina sakchyou

//req bhaneko user bata aune param url bata aune 

// server bata read garnu paryo bhane get
// server ma value halna tai post
//if data==null bhaneko tai kojeko data chaina bhane use huncha
//if(!category) tai save garda kunai data ayena bhane use hunchaso yedi data ayena bhane something went wrong data cha bhatala work huncha


//here yesko code ma:
// let category = await Category.findById(req.params.id)
//yo id tai abha hami showcategories ma bhyako id jun aucha teslai copypaster postman ma gayera  cont..
//url bnaune ra localhost:5000/findcategory/<id copy paste from showcategories>

