const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  token: { type: String },
  refreshToken: { type: String },
});

module.exports = mongoose.model("users", User);
