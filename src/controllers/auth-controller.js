const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

// Secret key for signing the JWT
const secret = "yo-mama";

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

  bcrypt.compare(req.body.password, loginObj.password, function (err, result) {
    if (result) {
      console.log("It matches!");
      return res.status(200).json("YOUR LOGGED IN BUDDY!!!");
    } else {
      console.log("Invalid password!");
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
      const user = new User({ username: req.body.username, password: hash });
      user.save().then((response) => {
        return res.status(201).json({ data: response });
      });
    });
  });
};
