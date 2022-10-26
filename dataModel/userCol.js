const database = require("../utils/database");
const ObjectID = require("mongodb").ObjectId;
const userProperties = ["email", "password"];
const validation = ["email", "password"];

async function create(data) {
  return await database.userModel().insertOne(data);
}
async function getDetailByCode(code) {
  const result = await database.userModel().find({ id: code }).toArray();
  return result[0];
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
