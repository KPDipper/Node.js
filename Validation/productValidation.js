exports.productValidation = (req, res, next) => {
  req.check("product_name", "Product name is required").notEmpty(); //esle product_name filed lai check garne yedi empty filed cha bahne yo message pass huncha

  req
    .check("product_price", "product price is required")
    .notEmpty()
    .isNumeric()
    .withMessage("Price must be in number");
  req
    .check("count_in_Stock", "Count in stock is required")
    .notEmpty()
    .isNumeric()
    .withMessage("Stocks must be in number");
  req
    .check("product_description", "Description is required")
    .notEmpty()
    .isLength({ min: 20 })
    .withMessage("Description must be atleast 20 characters in length.");
  req.check("category", "category is required").notEmpty();
  //yo tai duplicate name ko lagi

  const errors = req.validationErrors(); //yedi error ayo bhane yeta multple error haru array ma bascha
  //vlaidation ta express-validator kai method ho ra error tai validation error ma gayera bascha
  if (errors) {
    const showError = errors.map((err) => err.msg)[0]; //showError tai pass garna  ko lagi which means to show error//error tai array ma ayera bascha so to shw first error we need index  [0]
    //here first ko resolve bhaye bhane second resolve hucnah yedi hamil e array hatyou bhane sangai resolve huncha
    return res.status(400).json({ error: showError }); //error ayo bhane error return huncha
  }
  next(); //validate bhyo bhane next ko case ma jancha
};

exports.categoryValidation = (req, res, next) => {
  //yo tai empty pathuna mildena bhanera
  req.check("category_name", "Category name is required").notEmpty();

  const errors = req.validationErrors(); //yedi error ayo bhane yeta multple error haru array ma bascha
  //vlaidation ta express-validator kai method ho ra error tai validation error ma gayera bascha
  if (errors) {
    const showError = errors.map((err) => err.msg)[0]; //showError tai pass garna  ko lagi which means to show error//error tai array ma ayera bascha so to shw first error we need index  [0]
    //here first ko resolve bhaye bhane second resolve hucnah yedi hamil e array hatyou bhane sangai resolve huncha
    return res.status(400).json({ error: showError }); //error ayo bhane error return huncha
  }
  next(); //validate bhyo bhane next ko case ma jancha
};
