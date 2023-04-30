# **OTP Server**

This is a Node.js application that generates and verifies OTPs (One-Time Passwords) using JSON files and email.
Prerequisites

## Before running this application, you should have the following:

1. Node.js installed on your system.
2. A mail server provider account, such as mail.com or windowslive.
3. The login credentials for your mail server provider account.

## Installation

Clone this repository using the following command:

```
git clone https://github.com/ajalzahrani/OTPService
```

Install the required packages by running the following command inside the project directory:

```
npm install
```

Update the config object with your mail server provider configuration and login credentials in the index.js file.

## Usage

Start the server by running the following command:

```
node index.js
```

To generate and store an OTP, send a GET request to the /sendotp endpoint with the email parameter set to the email address where you want to receive the OTP. For example:

http://localhost:3000/sendotp?email=example@mail.com

This will generate a random 6-digit OTP and store it in a JSON file in the otps directory. The file will be named after the email address with the domain name removed.

If you want to test the OTP generation without actually sending an email, you can remove the transporter.sendMail() call and just log the OTP to the console and send an empty response.

To verify an OTP, send a GET request to the /verifyotp endpoint with the email and otp parameters set to the email address and OTP you want to verify, respectively. For example:

http://localhost:3000/verifyotp?email=example@mail.com&otp=123456

This will read the JSON file for the specified email address and check if the OTP matches and has not expired (5 minutes after generation). If the OTP is valid, the file will be deleted and a success response will be sent.

## License

This project is licensed under the MIT License.

## README Auther

ChatGPT 3.5
