const jwt = require("jsonwebtoken");
const config = require("../config/app.json");
const createSecretKey = async (payload) => {
  const options = {};
  return jwt.sign(payload, config.tokenKey, options);
};
const verifyToken = async (token) => {
  return jwt.verify(token, config.tokenKey);
};
module.exports = {
  createSecretKey,
  verifyToken,
};
