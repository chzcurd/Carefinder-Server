const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

//verifies a JWT and adds username and isAdmin to req object
exports.verifyJWT = (req, res, next) => {
  const token = req.headers.jwt;
  if (!token) {
    return res.status(400).json({ error: "jwt is required" });
  }

  jwt.verify(token, process.env.jwtSecret, async (err, decodedToken) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ error: "Unauthorized" });
    }

    //set username from token
    req.username = decodedToken.username;

    //set if admin is
    if (decodedToken.isAdmin === true) {
      try {
        //Check if user is still an admin
        const user = await User.findOne({ username: decodedToken.username });
        //user doesn't exist or is unauthorized
        if (!user || user.isAdmin !== true) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        //they are still, add in that they are verified
        req.isAdmin = true;
      } catch (error) {
        //catch any errors that come up
        return res.status(401).json({ error: "Unauthorized" });
      }
    }
    next();
  });
};
