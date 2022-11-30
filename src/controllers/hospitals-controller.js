const Hospital = require("../models/hospital-model");
const { param } = require("../routes/hospitals-routes");
const regexWrap = require("../helpers/helpers").regexWrap;

/*

hospitals-controller.js

 */
/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.index = async (req, res) => {
  let searchObj = {};

  const params = Object.keys(req.query);

  const badVals = [];

  params.forEach((param) => {
    switch (param) {
      case "id":
        searchObj.provider_id = regexWrap(req.query.id);
        break;
      case "name":
        searchObj.hospital_name = regexWrap(req.query.name);
        break;
      case "city":
        searchObj.city = regexWrap(req.query.city);
        break;
      case "state":
        searchObj.state = regexWrap(req.query.state);
        break;
      case "zipcode":
        searchObj.zip_code = regexWrap(req.query.zipcode);
        break;
      case "zipcode":
        searchObj.zip_code = regexWrap(req.query.zipcode);
        break;
      case "county":
        searchObj.county_name = regexWrap(req.query.county);
        break;
      case "type":
        searchObj.hospital_type = regexWrap(req.query.type);
        break;
      case "ownership":
        searchObj.hospital_ownership = regexWrap(req.query.ownership);
        break;
      case "emergency_services":
        searchObj.emergency_services = req.query.emergency_services;
        break;
      case "phone":
        searchObj.phone_number = regexWrap(req.query.phone);
        break;
      case "latitude":
        searchObj.latitude = regexWrap(req.query.latitude);
        break;
      case "longitude":
        searchObj.longitude = regexWrap(req.query.longitude);
        break;
      default:
        //passed in an invalid param
        badVals.push(param);
    }
  });

  if (badVals.length > 0) {
    res.status(400).send("Has invalid param(s): " + badVals);
    return;
  }

  console.log(searchObj);
  //Query the database
  const hospitals = await Hospital.find(searchObj).exec();
  res.json({ data: hospitals });
};

// POST localhost:3000/api/hospitals
exports.store = async (req, res) => {
  const hospital = new Hospital(req.body);
  const response = await hospital.save();
  res.status(201).json({ data: response });
};
