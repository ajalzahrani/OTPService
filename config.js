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

module.exports = config;
