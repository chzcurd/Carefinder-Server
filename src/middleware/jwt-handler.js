const jwt = require("jsonwebtoken");

//verifies a JWT and adds username and isAdmin to req object
exports.verifyJWT = (req, res, next) => {
  const token = req.headers.jwt;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.jwtSecret, (err, decodedToken) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ error: "Unauthorized" });
    }

    //set username from token
    req.username = decodedToken.username;

    //set if admin is
    if (decodedToken.isAdmin === true) {
      console.log("added admin");
      req.isAdmin = true;
    }
    next();
  });
};
