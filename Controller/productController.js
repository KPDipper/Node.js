const Product = require('../Model/product')//model lai tai hamile controller lai import garya ho hamile so we can now apply certain functions

exports.addProduct = async(req,res) => {
    let product = new Product({
        product_name : req.body.product_name,
        product_price: req.body.product_price,
        product_image: req.file.path,
        product_description: req.body.product_description,
        count_in_Stock: req.body.count_in_Stock,
        category: req.body.category
    })
    product = await product.save()
    if(!product){
        return res.status(400).json({error:"something went wrong"})
    }
    else{
        res.send(product)
    }
}

exports.showProducts = async (req, res) => {
    
  //yo pachi gareko connection garne bela
  let order=req.query.order ? req.query.order :1//yo bhaneko tai ascendng ho -1 tai decedning 
  let sortBy=req.query.order ? req.query.sortBy :'_id'
  let limit=req.query.order ? parseInt(req.query.limit ):2000


    
  let products = await Product.find().populate('category') .sort([[sortBy,order]]).limit(limit)//yo small cha instead of capital kina bhane this is field of product rather than model of ctegory itself
    //here populate tai arko table bata ako cha bhane tyo table ko id ko sato tyo table ko detail aucha
    //category table ma bhayeko sabai data ma tai category ma gayera rakcha.find le sabai return garcha//yesle sbaia bhae barko category dekhaucha like mobile laptop etc
    if (!products) {
      return res.status.json({ error: "something went wrong" });
    } else {
      res.send(products);
    }
  };

  //to view product//to find individual product
  //assume findproduct as product details
  exports.findProduct = async(req, res)=>{

    // let category = await Category.findOne({__id:req.params.id})//yesle object lincha
    let product = await Product.findById(req.params.id)//finfby id ma tai object banunu pardena

    if(!product){//here yedi spescific value return bhayena bhane category ma then !category ko ma jancha ra error aucha
        return res.status(400).json({ error: "something went wrong" });
    }
    else{
        res.send(product)
    }
}

exports.updateProduct =async (req,res)=>{
    let product = await Product.findByIdAndUpdate(//findbyidupdate le id lincha ra teslai update garcha
      req.params.id,//yo url bata aune value ho eslai update
      {
        product_name : req.body.product_name,//yo tai kun value halne bhanera jun tyo value update bhayera jancha
        product_price: req.body.product_price,//yo rigt ko tai user bata ako o form url bata ako cha//left ko model ko field bata ako ho
        product_image: req.file.path,
        product_description: req.body.product_description,
        count_in_Stock: req.body.count_in_Stock,
        category: req.body.category
      },
      {new:true}//jun value update bhcha tyo value tai dkehuna parcha tesko lagi {new: true }use huncha//use it for display
      ).populate('category')
      if(!product){
          return res.status(400).json({error:"something went wrong"})
      }
      else{
          res.send(product)
      } 
  }
  //here updata garna
  //value haru pathaunu cha bahne matra req.body chaincha
  


  
  //to delete product

exports.deleteProduct= (req,res)=>{
    let product =  Product.findByIdAndRemove(req.params.id)//yo tai kun chai product delete garne hamile id pathako
    //category ma tai abha delete bhayera response aucha ra product ma bascha
    .then(product=>{//yedi database sanga connect bhyo bhane matra ho
      if(!product){
        return res.status(400).json({error :"category not found"})//yedi product khali ayo bhane which means response yedi kei ayena bhane response yesto aucha.
        //if id ko fromat milena bhane yo error aucha
      }
      else{//yedi database sanga connect bhayo ra fromat milyo bhane yo resonse aucha
        return res.status(200).json({msg :"category deleted successfully"})//yedi product
  
      }}
    )
    .catch(error=>res.status(400).json({error: error}))//yedi database sanga connect garna sakena bhane yo huncha
  
  
  }
  


  
  