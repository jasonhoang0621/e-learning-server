const database = require("../utils/database");
const userProperties = ["email", "password"];
const validation = ["email", "password"];

async function create(data) {
  return await database.userModel().insertOne(data);
}

async function getDetailByEmail(email) {
  const result = await database.userModel().find({ email }).toArray();
  return result[0];
}

module.exports = {
  create,
  getDetailByEmail,
  validation,
  userProperties,
};
