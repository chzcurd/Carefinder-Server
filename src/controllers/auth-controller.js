const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

//login to the system
exports.login = async (req, res) => {
  //check for required fields
  if (
    typeof req.body.username !== "string" ||
    typeof req.body.password !== "string"
  ) {
    return res.status(400).send("Missing username or password!");
  }

  const findUser = {
    username: req.body.username,
  };
  const loginObj = await User.findOne(findUser);

  if (loginObj == null) {
    return res.status(400).send("invalid username or password");
  }

  bcrypt.compare(req.body.password, loginObj.password, function (err, result) {
    if (result) {
      //return only data needed for the token
      const returnData = {
        username: loginObj.username,
        isAdmin: loginObj.isAdmin,
      };
      //make jwt and return it
      const token = jwt.sign(returnData, process.env.jwtSecret, {
        expiresIn: process.env.jwtExp,
      });
      return res.status(200).json(token);
    } else {
      return res.status(400).send("invalid username or password");
    }
  });
};

// This route is called when a user signs up
exports.signup = async (req, res) => {
  //check that json was sent
  if (typeof req.body !== "object") {
    res.status(400).send("Data is not in json");
    return;
  }

  //check for required fields
  if (
    typeof req.body.username !== "string" ||
    typeof req.body.password !== "string"
  ) {
    return res.status(400).send("Missing username or password!");
  }

  const findUser = {
    username: req.body.username,
  };
  const loginObj = await User.findOne(findUser);
  if (loginObj != null) {
    return res.status(400).send("user already signed up!");
  }

  // Get the plaintext password from the request body
  const password = req.body.password;

  // Generate a salt using bcrypt's genSalt method
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      // If an error occurs, send a 500 Internal Server Error
      // response with a generic error message
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Use the salt to hash the password using bcrypt's hash method
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        // If an error occurs, send a 500 Internal Server Error
        // response with a generic error message
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Store the hashed password in the database
      try {
        const user = new User({
          username: req.body.username,
          password: hash,
          isAdmin: false,
        });
        user.save().then((response) => {
          //return only data needed for the token
          const returnData = {
            username: response.username,
            isAdmin: response.isAdmin,
          };
          //make jwt and return it
          const token = jwt.sign(returnData, process.env.jwtSecret, {
            expiresIn: process.env.jwtExp,
          });
          return res.status(201).json(token);
        });
      } catch (error) {
        return res.status(500).send("error adding user");
      }
    });
  });
};
