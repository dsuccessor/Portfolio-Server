const nodemailer = require("nodemailer");

const sendMail = async (mailSubject, receipentMail, mailContent)=> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: receipentMail,
    subject: mailSubject,
    text: mailContent,
  };

 return transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw new Error(error);
    } else {
      console.log("Email Sent");
      return true;
    }
  });
}

module.exports = { sendMail };