const express = require("express");
const fs = require("fs");
const nodemailer = require("nodemailer");
let cors = require("cors");
const app = express();
const port = 3000;
const config = require("./config");
const {
  saveFile,
  readFile,
  deleteFile,
  generateExpiryTime,
  generateOTP,
} = require("./utils");

app.use(cors());
app.use(express.json());

let transporter = nodemailer.createTransport(config.hotmail);

// send phone opt route
app.post("/sendotp-phone", (req, res) => {
  // generate a random 6-digit OTP and set an expiration date 5 minutes in the future)

  let phonenumber = req.body.phonenumber;
  let otp = generateOTP(4);
  let expires = generateExpiryTime(120);

  // store the OTP in a JSON file
  let data = { phonenumber: phonenumber, otp: otp, expires: expires };

  saveFile(`otps/${phonenumber}.json`, data);

  res.send({ otp: otp, expires: expires });
});

// verify phone opt route
app.post("/verifyotp-phone", (req, res) => {
  // extract the OTP from the request body
  let phonenumber = req.body.phonenumber;
  let otp = req.body.otp;

  // read the OTP from the JSON file
  let data = readFile(`otps/${req.body.phonenumber}.json`);
  console.log("coming phonenumber", phonenumber);
  console.log("coming otp", otp);
  console.log("saved data: ", JSON.stringify(data));

  // check if the OTP is valid and has not expired
  if (data.otp.toString() !== otp || data.expires < Date.now()) {
    res.status(401).send({ error: "Invalid OTP" });
    return;
  }

  // delete the OTP file and return a success response
  deleteFile(`otps/${req.body.phonenumber}.json`);

  res.send({ message: "OTP verified successfully" });
});

// send email otp route
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

// verify email otp route
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
