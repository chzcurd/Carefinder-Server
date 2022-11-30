/*

Put your hospital model here
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const hospitalSchema = new Schema({
  provider_id: String,
  hospital_name: String,
  address: String,
  city: String,
  state: String,
  zip_code: String,
  county_name: String,
  hospital_type: String,
  hospital_ownership: String,
  emergency_services: Boolean,

  phone_number: String,

  latitude: String,
  longitude: String,
});

module.exports = mongoose.model("Hospital", hospitalSchema);
