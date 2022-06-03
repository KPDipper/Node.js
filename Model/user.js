const mongoose = require("mongoose");
const uuidv1 = require("uuidv1"); //esle hash id generate garcha //hashing garna ko lagi generate hune ho
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },

    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
    role: {
      type: Number, //hamile number deko since compare garna sajilo huncha bhanera suppose admin lai 0 super admin lai 1 then it will be easy to compare
      required: true,
      default: 0,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    salt: String, //to encrypt password
  },
  { timestamps: true }
);

//password jaba user bata aucha teslai virtual field bata aucha tespachi hash password generate huncha

//virtual field tai user bata password aucha jata tal gayera generated huncha

userSchema
  .virtual("password")
  .set(function (password) {
    //hash password save garna yeta huncha
    this._password = password; //virtual field ma gayera basyo that means its(_password) temporary
    this.salt = uuidv1(); //uuidv1 le tai unique key generate garcha
    this.hashed_password = this.encryptPassword(password); //hasshed password tai model ko password ho
  })
  .get(function () {
    return this._password;
  }); //password return garcha jata bata call huda keri//this._password tai virtual field ko password ho
//_password yo tai temporary field ho

//method:
//database basne password tai diffenet huncha tyo tai tala ko method bata huncha
userSchema.methods = {
  encryptPassword: function (password) {
    if (!password) {
      return "";
    } else {
      try {
        return (
          crypto
            .createHmac("sha256", "this.salt") //esle tai encrypt garne work garhca//this bhaneko yo model ho bhanera januna ko lagi
            //sha256 encryption ko algorthim ho.this.salt ra sha256 create garera hami ecnryption create gacryou
            //unique id lai hamile encrypt huncha so now this.encryptPassword(password) yeta transfer huncha
            .update(password)
            .digest("hex")
        ); //hexadecimal ma convert huncha
      } catch (error) {
        return error;
      }
    }
  },

  authenticate: function(plaintext) {
    return this.encryptPassword(plaintext) === this.hashed_password;
    //database ma save hune tai hashed_password ho
    //plaintext tai user bata aune password  ho so we check password ra database
    //used it in login

    //user le k password pathyo check garcha jun plaintext bhyo ra database ma hashed password bhyo so they are comapre to each other
  },
};

module.exports = mongoose.model("User", userSchema); //yo User taii model bhyo
