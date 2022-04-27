const express = require("express"); //to create express api.express tai hamile index ma import gareko using require('express)
// const { showInfo, showMessage } = require("./Controller/categoryController");
require("dotenv").config(); //yo tai dotenv bata configuration import gareko



const app = express();
const port = process.env.PORT || 8000;
//process.env le tai .env ma bhako variable use garna paincha
// || is used if 5000 doesn't work so either one of them work

const db= require('./Database/connection')//yeta  tai abha connection function connection.js ma bhayeko yeta ayera import huncha ra databse ra backend tai connection establisehd huncha

const bodyParser=require('body-parser')//body-parser:body ma bhako data read garna ko lagi use hunes

// app.get('/',(req,res)=>{res.send("Welcome to express js.This is a test.Does it work?s")})

//request/response- method ho request tai user le server ai request pathucha ra response tai server le user lai pathune
//server le response garda res.send("..") garera pathucha


// app.get('/',showInfo)//yo tai hamile function call garcya so hamile function index ma banunu ko sato like we did it upper code
// //hamile yesari call garna pauchyou

// app.get('/next',showMessage)
//now instead of this again we can make route folder and make categoryroute.js and define new function router.in which 
//we copy paste both app.get showinfo and show message to that js file then rename app to router as router is new function  where we have define the route path

const CategoryRoute = require('./Route/categoryRoute')//yo tai hamile route call gareko index.js ma ra require le tai categoryRoute lai import garcha yeta
const ProductRoute=require('./Route/productRoute')
const UserRoute=require('./Route/userRoute')
const OrderRoute = require('./Route/orderRouter')

const morgan =require('morgan')
// const expressValidator = require('express-validator')
const cookieParser= require('cookie-parser')
const cors = require('cors')
// const nodemailer= require('nodemailer')



app.use(bodyParser.json())//body bata ako value read garna ko lagi//read garna ko agi json format ma hunu parcha
//body bhaneko data k ma pathune ho just like form ko field ho


app.use('/public/uploads',express.static('public/uploads'))//agadi ko tai url ho pachadi ko tai filename ho
//here then go to mongodb.com then go to bbrowese collection and go prdouct(table strcture) then copy then filepath 
//then go to browser tye "localhost:5000<>Filepath<>"

app.use(morgan('dev'))//here esle tai yedi url ma kei error ako cha bhane bhandincha
// app.use(expressValidator())
app.use(cookieParser())
app.use(cors())//yesle fron end sanga connect garne
// app.use(nodemailer())


app.use('/api',CategoryRoute)//yesma app.use tai preffix ko lagi use huncha and app tai yo page ko function bhayera use gareko ho
//variable name should be capital

app.use('/api',ProductRoute)
app.use('/api',UserRoute)
app.use('/api',OrderRoute)


//listen server run huna ko lagi hos
//app.listen le tai server run bhayepachi port ko value tancha from above then can be used in below
//j hos .listen le tai const port use garcha
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});



//here package.json ma gayera test text lai start text banune
//ra tesko bitra bhaeko value ma change garer _ nodemon index.js halne then
//go to terminal npm start garne
//so now every time we change the valuenin code server will restart every time


//index.js nai apiho .REST api tai hamile framework
//middleware:yo tai frontend ra backend connect ko lagi use hune