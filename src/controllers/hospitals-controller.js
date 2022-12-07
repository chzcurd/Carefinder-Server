const Hospital = require("../models/hospital-model");
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

  if (hospitals.length === 0) {
    res.status(404).send("No hospitals found!");
    return;
  } else {
    res.status(200).json({ data: hospitals });
    return;
  }
};

// POST localhost:3000/api/hospitals
exports.store = async (req, res) => {
  //check that user is an admin before running
  if (req.isAdmin !== true) {
    res.status(403).send(`User "${req.username}" is not an admin!`);
    return;
  }

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
  //check that user is an admin before running
  if (req.isAdmin !== true) {
    res.status(403).send(`User "${req.username}" is not an admin!`);
    return;
  }

  const data = req.body;

  if (typeof data !== "object") {
    res.status(400).send("Data is not in json");
    return;
  }

  if (!req.query.id) {
    res.status(400).send("id not provided!");
    return;
  }

  const query = { provider_id: req.query.id };

  data.loc = [data.longitude, data.latitude];

  console.log(data);

  const response = await Hospital.replaceOne(query, data, {
    upsert: true,
    runValidators: true,
  }).exec();
  console.log(response);

  //made new document
  if (response.upsertedCount === 1) {
    res.status(201).json({ data: data });
  }
  //updated document
  else if (response.matchedCount === 1) {
    res.status(200).json({ data: data });
  } else {
    res.status(400).send("Error: bad request!");
  }
};

// DELETE localhost:3000/api/hospitals
exports.delete = async (req, res) => {
  //check that user is an admin before running
  if (req.isAdmin !== true) {
    res.status(403).send(`User "${req.username}" is not an admin!`);
    return;
  }

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

  //console log the search obj
  console.log(searchObj);
  //get hospitals that will be deleted

  const session = await Hospital.startSession();
  try {
    session.startTransaction();
    const deleted_hospitals = await Hospital.find(searchObj)
      .session(session)
      .exec();
    //exit early if no hospitals found to delete
    if (deleted_hospitals.length === 0) {
      res.status(404).send("Error: no hospitals found to delete!");
      await session.abortTransaction();
      return;
    }

    //delete hospitals (deleteMany command is much faster when deleting many objects)
    const response = await Hospital.deleteMany(searchObj, { session });
    console.log(deleted_hospitals);

    //check to see if same number of hospitals deleted are the same number of ones that were returned
    if (deleted_hospitals.length !== response.deletedCount) {
      res
        .status(500)
        .send(
          `Concurrency Error, delete canceled! please try again. Expected ${deleted_hospitals.length} hospitals to be deleted, but ${response.deletedCount} were deleted instead!`
        );
      await session.abortTransaction();
    }
    //transaction was good, commit it
    else {
      await session.commitTransaction();
      //check that hospitals were deleted
      if (response.deletedCount > 0) {
        res.status(200).json({ data: deleted_hospitals });
        return;
      }
      //send 404 if no hospitals deleted
      else {
        res.status(404).send("Error: no hospitals found to delete!");
        return;
      }
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error);
  }
  session.endSession();
};
