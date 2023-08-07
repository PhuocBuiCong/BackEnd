const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  firstName: { type: String },
  lastName: { type: String },
  token: { type: String },
  refreshToken: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

module.exports = mongoose.model("users", User);
