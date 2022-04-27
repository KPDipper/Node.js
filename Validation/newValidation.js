const {check,validationResult}=require('express-validator')


exports.newValidation= (req,res,next)=>{

    const errors = validationResult(req)

    if(errors.isEmpty()){
        next()
    }
    else{
        return res.status(400).json({error:errors.array()[0].msg})//herehamile lai first error ko message lina man cha bahne
        //here it shows the error one by one
        // return res.status(400).json({error:errors.array().map(err=>err.msg)})
    }

}

exports.categoryCheck =[//here we placed the erros in arraun then display in the array

    check('category_name','category is required').notEmpty()
    .isLength({min:3}).withMessage('Category must be atleast 3 characters')
]


exports.productCheck =[
    check('product_name','Product name is required').notEmpty(),
    check('product_price','Product price is required').notEmpty()
    .isNumeric()
    .withMessage('Price must be a number'),
    check('count_in_Stock','Count in stock is required').notEmpty()
    .isNumeric()
    .withMessage('Count must be a number'),
    check('product_description','Product description is required').notEmpty()
    .isLength({min:20})
    .withMessage('Description must be at least 20 characters in length'),
    check('category','Category is required').notEmpty()
]

exports.userCheck=[

    check('first_name','First name is required').notEmpty(),
    check('last_name',' Last name is required').notEmpty(),
    check('date_of_birth',' Date of birthday is required').notEmpty(),
   check('gender',' name is required').notEmpty(),

    check('email','Email is required').notEmpty().isEmail().withMessage('Email is required'),
   check('password','Password is required').notEmpty().isLength({min:4, max:20}).withMessage("Password must be atleast of 4 characters & shouldn't exced 20 chacaters")
    
]