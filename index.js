const express = require("express");
const fs = require("fs");
const nodemailer = require("nodemailer");
const sendOTP = require("./sendOTP");
let cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

// custom config for the trasporter
const config = {
  // mail.com email server provider config
  mail: {
    host: "smtp.mail.com",
    port: 587, // 587
    secure: false, // use SSL
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: "your-mail@mail.com", // enter your full email address.
      pass: "password", // enter your email address password.
    },
  },

  // windowslive email server provider config
  hotmail: {
    host: "smtp.hotmail.com",
    port: 587, // 587
    service: "hotmail",
    secure: false, // use SSL
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: "your-email@windowslive.com", // // enter your full email address.
      pass: "password", // enter your email address password.
    },
  },
};

let transporter = nodemailer.createTransport(config.hotmail);

// using json file
app.get("/sendotp", (req, res) => {
  // generate a random 6-digit OTP and set an expiration date 5 minutes in the future
  let otp = Math.floor(1000 + Math.random() * 9000);
  let expires = new Date(Date.now() + 5 * 60 * 1000);

  // store the OTP in a JSON file
  let data = { email: req.query.email, otp: otp, expires: expires };
  fs.writeFileSync(
    `otps/${req.query.email.slice(0, req.query.email.indexOf("@"))}.json`,
    JSON.stringify(data)
  );

  // remove bellow three lines to allow send email feature.
  console.log(req.query.email, otp);
  res.end();
  return;
  // setup email data
  let mailOptions = {
    from: config.hotmail.auth.user, // sender address
    to: req.query.email, // list of receivers
    subject: "OTP", // Subject line
    text: "Use this opt: " + otp, // plain text body
    html: "<h1>" + otp + "</h1>", // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    try {
      if (error) {
        res.status(500).send({ error: "Failed to send OTP", msg: error });
      } else {
        console.log("email sent");
        res.send({ message: "OTP sent successfully" });
      }
    } catch (e) {
      res.status(500).send({ error: "Failed to send OTP catched" });
    }
  });
  // res.send({ message: "OTP sent successfully" });
});

app.get("/verifyotp", (req, res) => {
  // read the OTP from the JSON file

  let data = JSON.parse(
    fs.readFileSync(
      `otps/${req.query.email.slice(0, req.query.email.indexOf("@"))}.json`
    )
  );

  console.log("coming otp", req.query.otp);
  console.log("data otp", data.otp);

  // check if the OTP is valid and has not expired
  if (data.otp !== parseInt(req.query.otp) || data.expires < Date.now()) {
    res.status(401).send({ error: "Invalid OTP" });
    return;
  }

  // delete the OTP file and return a success response
  fs.unlinkSync(
    `otps/${req.query.email.slice(0, req.query.email.indexOf("@"))}.json`
  );
  res.send({ message: "OTP verified successfully" });
});

app.listen(port, () => {
  console.log(`OTP server listening on port ${port}`);
});
