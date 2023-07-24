const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RefreshToken = new Schema({
  userId: { type: String },
  token: { type: String },
});

module.exports = mongoose.model("refresh_tokens", RefreshToken);
