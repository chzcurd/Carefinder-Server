/*

Put your hospital model here
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const limit = (val) => {
  return val.length === 2;
};

const isNumber = (val) => {
  return !isNaN(parseFloat(val));
};

const hospitalSchema = new Schema({
  provider_id: { type: String, required: true },
  hospital_name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: {
    type: String,
    required: true,
    validate: [limit, "Length needs to be 2"],
  },
  zip_code: {
    type: String,
    required: true[(isNumber, "Invalid ZipCode (needs to be in a string)")],
  },
  county_name: { type: String, required: true },
  hospital_type: { type: String, required: true },
  hospital_ownership: { type: String, required: true },
  emergency_services: { type: Boolean, required: true },

  phone_number: {
    type: String,
    required: true,
    validate: [isNumber, "Invalid Phone Number (needs to be in a string)"],
  },

  latitude: {
    type: String,
    required: true,
    validate: [isNumber, "Latitude needs to be a number in string format"],
  },
  longitude: {
    type: String,
    required: true,
    validate: [isNumber, "Longitude needs to be a number in string format"],
  },

  //location for geo dist searching
  loc: {
    type: [Number],
    validate: [limit, "dist loc not provided/invalid"],
  },
});

module.exports = mongoose.model("Hospital", hospitalSchema);
