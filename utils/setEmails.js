const nodemailer = require("nodemailer"); //nodemailer ko kam email pathuna ko lagi //login garda keri verfication email garnu cha bahne yo pacakge use hunchas
//first go to site mailtrap.io then change curl to node js ra tyo code lai tai senemail ko function bitra past gardine

const sendEmail = (options) => {
  //email pathuna ko lagi which option like "from " and " to"

  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,//we create varible so that pachi host port change garda sajilo hos bhanera matra ho
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  transport.sendMail(mailOptions);
};

module.exports = sendEmail;

//suru ma lgoin garda sad
