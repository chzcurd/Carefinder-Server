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

  //variables for distance searching
  let rawdist = null;
  let rawLat = null;
  let rawLong = null;
  let usingDist = false;

  //Add params for all of the querys
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
        rawLat = req.query.latitude;

        break;
      case "longitude":
        searchObj.longitude = regexWrap(req.query.longitude);
        rawLong = req.query.longitude;
        break;
      case "dist":
        usingDist = true;
        rawdist = req.query.dist;
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

  //code to calc distance
  if (usingDist) {
    //parse values to numbers
    const dist = parseFloat(rawdist);
    const lat = parseFloat(rawLat);
    const long = parseFloat(rawLong);

    //check if dist is a number and is > 0
    if (isNaN(dist) || dist <= 0) {
      res
        .status(400)
        .send(
          "dist needs to be a number > 0 (distance is in miles). Set as: " +
            rawdist
        );
      return;
    }
    //error if lat and long arn't set
    else if (isNaN(lat) || isNaN(long)) {
      res
        .status(400)
        .send(
          "latitude and longitude need to be set, or cannot be parsed to a number. Set as long: " +
            rawLong +
            " Lat: " +
            rawLat
        );
      return;
    } else {
      //miles to meters conversion
      const METERS_PER_MILE = 1609.34;

      //add search method for location
      searchObj.loc = {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [long, lat],
          },
          $maxDistance: dist * METERS_PER_MILE, //convert meters into miles, so we can search distance in miles
        },
      };

      //remove lat and long from searchobj
      delete searchObj.latitude;
      delete searchObj.longitude;
    }
  }

  //console log what came back
  console.log(searchObj);
  //Query the database
  const hospitals = await Hospital.find(searchObj).exec();
  res.json({ data: hospitals });
};

// POST localhost:3000/api/hospitals
exports.store = async (req, res) => {
  const data = req.body;

  if (typeof data !== "object") {
    res.status(400).send("Data is not in json");
    return;
  }

  data.loc = [data.longitude, data.latitude];

  console.log(data);
  const hospital = new Hospital(data);
  const response = await hospital.save();
  res.status(201).json({ data: response });
};

// PUT localhost:3000/api/hospitals
exports.update = async (req, res) => {
  const data = req.body;

  if (typeof data !== "object") {
    res.status(400).send("Data is not in json");
    return;
  }

  if (!req.query.id) {
    res.status(400).send("id not provided!");
  }

  const query = { provider_id: req.query.id };

  data.loc = [data.longitude, data.latitude];

  console.log(data);

  const response = Hospital.updateOne(query, data, { upsert: true });
  res.status(201).json({ data: response });
};
