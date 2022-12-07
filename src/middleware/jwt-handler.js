const jwt = require("jsonwebtoken");

//verifies a JWT and checks if user is an Admin
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

    if (decodedToken.isAdmin === true) {
      req.isAdmin = true;
    }
    next();
  });
};
