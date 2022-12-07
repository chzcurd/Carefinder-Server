/*

Put your user model here
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
});

module.exports = mongoose.model("User", userSchema);
