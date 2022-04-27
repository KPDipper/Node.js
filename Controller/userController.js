const User = require("../Model/user");

const jwt = require("jsonwebtoken"); // it is used for aunthentication the user
const  expressJWT  = require("express-jwt");//yesle authorization ko kam garcha
const cookieParser = require("cookie-parser");
const sendEmail = require("../utils/setEmails");
const crypto = require("crypto"); //crypto le token encrypt garne ho ra pathune ho
const Token = require("../Model/token");

//to adduser

exports.addUser = async (req, res) => {
  //yo tai request server lai ayepachi hune kam ho
  let user = new User({
    //yo request bata aucha
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    date_of_birth:req.body.date_of_birth,
    gender:req.body.gender,
    email: req.body.email,
    password: req.body.password,
  });
  User.findOne(
    { email: user.email }, //yesle paila rageister garya cha ki chaina check garne
    async (error, data) => {
      if (data == null) {
        //null cha bhane save huncha
        user = await user.save(); //then it will be save
        let token = new Token({
          //yo token database ma save huncha tei email verfication ko lagi for 24 hours activate huncha
          //database ma gayera ra token ra user save huncha
          //login ko  token tai cookie save garera huncha ra jaba sign out huncha cookie clear huncha so as the token ni clear huncha
          //yo tai confirm na gare samma token save huncha tespachi kam chaina

          token: crypto.randomBytes(16).toString("hex"), //random bytes le randomly token generate garyo upto 16 characters ra crypto le teslai encrypt garcha
          userId: user._id,
        });
        token = await token.save(); //yo tai token database save garna ko lagi ho
        if (!token) {
          return res.json({ error: "Something went wrong with token" });
        }
        //send email  verfication

        const url =
          process.env.FRONTEND_URL + "/email/confirmation/" + token.token;//yo url abha front end ko myroute ma rakhne
        //yo hamile front end ma jun confrimation button aucha tyo certain url ma janu paryo
        //yo url bitra tai confrimation code haru huncha

        sendEmail({
          from: "pokhare2468@gmail.com", //yo tai hamro email ho
          to: user.email, //abha jasko email verfy garnu cha teslai jancha
          subject: "Verification Email",
          text: ` Hello, \n Please click on the following link to verify your email.\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`,
          //yo bhaneko tai jaba verfy garchyoum email teti bela hami lai yo url link ma lagdincha hami lai
          //token.token ma tfirst tai model ho arko tai field ho
          //token.token ma tai right side ko token ko tai url ko token bhyo ra mathi bhanko token.save() ma database ma bhyo jaba verfy ma click garum then
          //url ma jancyou ra token ni huncha url ra url ko token ra database ko token compare garne ra email confirm garyoum
          ///hamile same token databse ma pathyoum ra tei same kura url ma pathyoum
          html: `<button><a href='${url}'>Verify</button>`,
        });

        if (!user) {
          //yedi database ma save bhyena bhane huncha like network error
          return res.status(400).json({ error: "something went wrong" });
        } else {
          res.send(user);
        }
      } else return res.status(400).json({ error: "Email already exist" }); //yedi already email register cha bhane error aucha
    }
  );
};

//tei mathi ko token compare garne abha
//to verify:
//abha yo url ko token ai racha eg: http://localhost:5000/user/confirmation/1958c44949b0c2d601b532ad7e6c1009
//url tai confirmation bhyo
//abha yo token lai database sanga compare garne

//resend verification email:

exports.resendVerification = async (req, res) => {
  let user = await User.findOne({ email: req.body.email }); //hamile user cha ki chaina chekc garerko
  if (!user) {
    return res
      .status(400)
      .json({ error: "The email is not registered.Please Registered" }); //here account register na garikina athwa accout na bhaynekina yeti kai verfication garna pauna
  }
  //if user is already verfied
  if (user.isVerified) {
    return res
      .status(400)
      .json({ error: "User is already verfied,Please login to continue" });
  }
  let token = new Token({
    token: crypto.randomBytes(16).toString("hex"),
    userId: user._id,
  });
  token = await token.save();
  if (!token) {
    return res.json({ error: "something went wrong" });
  }
  // send Re-verification email
  const url = process.env.FRONTEND_URL + "/email/confirmation/" + token.token;
  sendEmail({
    from: "noreply@ourpage.com",
    to: user.email,
    subject: "Verification Email",
    text: ` Hello, \n Please click on the following link to verify your email.\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`,
    html: `<button><a href='${url}'>Verify</button>`,
  });

  res.json({ message: "Verfication link has been sent to email" });
};

//verify user:

exports.verifyUser = (req, res) => {
  //to check token:

  Token.findOne({ token: req.params.token }, (error, token) => {
    //yesma callback function use gareko cha instead of await async
    //here abha token hami url bata lincyoum so hamile params use garchyoum

    if (error || !token) {
      //error ayo athawa bhane databse sanga connect bhayena bahne //ra !token tai database sanga connect bhyo tara token betyina

      return res
        .status(400)
        .json({ error: "Invalid token or token may have been expired" });
    }

    //abha token betayo ra tesko asscoiated user kojne re ra url ko token ra user ko token kojne
    //yo token cha ki chaina
    //yo token bhakai user cha ki chaina daabase ma check garne

    User.findOne({ _id: token.userId }, (error, user) => {
      if (error || !user) {
        return res.status(400).json({ error: "Unable to find user" });
      }

      //if already verified cha bahne no need to do it againand to login continue
      if (user.isVerified) {
        return res
          .status(400)
          .json({ error: "User is already verfied.Please login to continue" });
      }

      user.isVerified = true;
      //abha aile samma sab dhik cha bahne tal ko code use garne
      user.save((err) => {
        if (err) {
          return res.status(400).json({ error: err }); //yedi message dekahunu cha bhane semi:colon use garne not arror function
        }
        res.json({ message: "Congratulations, your account has been verified." });
      });
    });
  });
};

//sign in:

exports.userSign = async (req, res) => {
  const { email, password } = req.body; //yo tai body bata ako ho ra hami le destructure garera lyako ho
  //check if email is registered or not

  const user = await User.findOne({ email }); //yesma tai register garya cha ki chaina hanera check garne ho
  if (!user) {
    //yedi user chaina bhane

    return res.status(400).json({ error: " Email is not registered" });
  }
  //email cha tespachi password check garne ki match huncha ki chaina bhanera
  //check password to authenticate
  if (!user.authenticate(password)) {
    //yedi email milyo tara password mile na bhane like email and password doesn't match
    //here authenticate model tai hamile model bata use garya ho

    return res.status(400).json({ error: "Email and password doesn't match" });
  }

  //check if user is verfied or not
  //vefrifying the account

  if (!user.isVerified) {
    //login bhyo tara verified bhayena bhane use huncha
    return res
      .status(400)
      .json({ error: " User not verified.please verify to continue" });
  }

  //abha login garera rakhnu paryo bhane token generate garne ra tesali cookie ma store garne
  //so that database le thapyos user ko role k hos harek time when they nter the account

  //jwt.sign le tai token generate garcha
  //abha login garera rakhnu paryo bhane tokin generate garne ra tesali cookie ma store garne
  //generating token using user_id and jwt
  //else duita value lincha user id ra user role  tyo token tai cookie ma gayera bascha

  const token = jwt.sign(
    { _id: user._id, user: user.role },
    process.env.JWT_SECRET
  ); //id ra user ko role chainccha //ra proccess env jwt_secret haile env bata call garya ho.
  res.cookie("myCookie", token, { expire: Date.now() + 9999999 }); //here to save the token in cookie name "mycookie" where it's expiry date will be 99999999ms later

  //return information to front end

  //user le login garna kojyo bhane  yo  code le check garcha yedi yo user right cha ki chaina
  const { _id, name, role } = user; //de-structuring gareko//so display huda kheri id,name ra user role matra huncha
  return res.json({ token, user: { name, email, role, _id } });
};

//user signout

exports.userSignout = (req, res) => {
  res.clearCookie("mycookie"); //my cookie ma bhayeko data lai clear gareko
  res.json({ message: "Signed out sucessfully." });
};

//for forget password:
exports.forgetPassword = async (req, res) => {
  //find user paila herne user cha ki chaina

  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    //if user is not found
    return res.status(400).json({ error: "User not found.Please register" });
  }
  //generate token if user is found//completely new token generate//yo password reset ko lagi token yo email sanga match garnu paryo so yo token generate gareko
  let token = new Token({
    userId: user._id,
    token: crypto.randomBytes(16).toString("hex"),
  });
  //save token in databases
  token = await token.save();
  if (!token) {
    return res.status(400).json({ error: "Something went wrong" });
  }

  // const url = `http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}`
  //send email//yehi token mail ma pathuna
  sendEmail({
    from: "wuhuh@gmail.com",
    to: user.email,
    subject: "password reset link",
    text: ` Please click on the link below to reset your password. <br> \n http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}`,
    html: `<button>Reset Password</button>`, //yesma click garyou bhane hami reset password function ma janchyou which down below
  });

  res.json({ message: "Password reset link has been sent to your email" });
};

//now after clicking reset password in above then

exports.resetPassword = async (req, res) => {
  //find valid token//abha mathi ko url ko token linu parcha so we use params for url
  let token = await Token.findOne({
    token: req.params.token, //token taneko url bata which is provided by forgotpassword
  });
  if (!token) {
    //here if url ma token betyina bahne
    return res
      .status(400)
      .json({ error: "Invalid token or token may have been expired" });
  }

  //find user if token is valid
  let user = await User.findOne({ email: req.body.email, _id: token.userId }); //finding token is not enough since anybody can use it so we need to confirm email too
  //token ma bhako userid jun email ra user le deko provide gareko eamil match garnu paryo
  if (!user) {
    //yedi email milena bhane
    return res.status(400).json({ error: "Email is not registred" });
  }

  //now reseting password
  user.password = req.body.password; //yo tai nayapassword
  user = await user.save(); //ani teslai save gareko

  if (!user) {
    return res.status(400).json({ error: "Failed to update password" });
  }
  res.json({ message: "Password has been rest successfully." });
};

//to view all the user who register

exports.userList = async (req, res) => {
  const user = await User.find().select("-hashed_password"); //sab kojna ko lagi user ind use garne//slecet hashed password tai user ko password na dekhuna ko lagi
  if (!user) {
    return res.status(400).json({ error: "Something went wrong" });
  }

  res.send(user);
};

//to find particular user only
exports.findUser = async (req, res) => {
  const user = await User.findById(req.params.userid).select("-hashed_password"); //hamile url baa userid tanchyou for indivdual user//link create garda keri userid aucha so findbyId use garne
  //-hashed-password tai yesko field name ho ra user ko password na dekhuna ko lagi aile |- use gareko
  //suppose list haru ma click garyo bhane link aucha tei url ma aucha so tannu paryo that's why we use params
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }
  res.send(user);
};

//require sign in //category add ganr apaunna user le //order garna login tai garnai parcha
//login hunai parcha aile ko lagi tai

//authorization
exports.requireSignin = expressJWT({
  secret: process.env.JWT_SECRET,
  algorithms:['HS256'],
  userProperty: 'auth'
})

//here login garnu parcha to add category but postman ma mildena so and sign in garera enough hudena postman//
//so we have to go like addcategory ma gayoum re then header ma jane ra key ma authorization type garne
//then value ma bearer type garne space garne ra sign in ma token aucha teslai copy paste garera yeta paste garne
//now we can addcategory finally

//category add garna ko lagi admin hunu paryo ra admin hunna ko lagi login hunu paryo
//aile ko lagi kasle sign in garyo tyo admin ho and only they are allowed it
