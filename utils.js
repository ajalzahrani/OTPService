const fs = require("fs");

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

function generateExpiryTime() {
  const now = new Date();
  const expiryTime = new Date(now.getTime() + 5 * 60 * 1000);
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
