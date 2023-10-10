const nodemailer = require("nodemailer");

const sendMail = async (mailSubject, receipentMail, mailContent) => {
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

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        reject(err);
        console.log("Failed to deliver the mail");
      } else {
        resolve(response);
        console.log("Mail delivered");
      }
    });
  });

}

module.exports = { sendMail };