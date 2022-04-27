
exports.userValidation= (req,res,next)=>{
    req.check('first_name','First name is required').notEmpty()
    req.check('last_name',' Last name is required').notEmpty()
    req.check('date_of_birth',' Date of birthday is required').notEmpty()
    req.check('gender',' name is required').notEmpty()

    req.check('email','Email is required').notEmpty().isEmail().withMessage('Email is required')
    req.check('password','Password is required').notEmpty().isLength({min:4, max:20}).withMessage("Password must be atleast of 4 characters & shouldn't exced 20 chacaters")
    req.check('')

    const errors=req.validationErrors()//yedi error ayo bhane yeta multple error haru array ma bascha
   //vlaidation ta express-validator kai method ho ra error tai validation error ma gayera bascha
    if(errors){
   const showError = errors.map(err=>err.msg)[0]//showError tai pass garna  ko lagi which means to show error//error tai array ma ayera bascha so to shw first error we need index  [0]
   //here first ko resolve bhaye bhane second resolve hucnah yedi hamil e array hatyou bhane sangai resolve huncha
   return res.status(400).json({error: showError})//error ayo bhane error return huncha
    }
    next()//validate bhyo bhane next ko case ma jancha
}