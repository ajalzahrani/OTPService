const fs = require("fs");

function generateOTP(digits = 4) {
  const multiplier = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(multiplier + Math.random() * (max - multiplier + 1));
}

function generateExpiryTime(seconds = 120) {
  const now = new Date();
  const expiryTime = new Date(now.getTime() + seconds * 1000);
  return expiryTime;
}

function saveFile(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data));
}

function readFile(filename) {
  return JSON.parse(fs.readFileSync(filename));
}

function deleteFile(filename) {
  fs.unlinkSync(filename);
}

module.exports = {
  generateOTP,
  generateExpiryTime,
  saveFile,
  readFile,
  deleteFile,
};
