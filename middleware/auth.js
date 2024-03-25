const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
try {
  const decoded = jwt.verify(
    token.replace("Bearer ", ""),
    "377fc8160979b9ea861e34a4c2e8c183123b970d74001e091835677588a8bce5"
  );
  console.log(decoded); // Log decoded token
  req.user = decoded;
  next();
} catch (error) {
  console.error(error); // Log the error for debugging
  return res.status(401).json({ message: "Token is not valid" });
}
};

module.exports = auth;

