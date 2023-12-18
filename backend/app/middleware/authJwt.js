const jwt = require("jsonwebtoken");
const config = require("../config/constant.js");
const db = require("../models/index.js");

// Verifying the token
let verifyToken = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
    jwt.verify(token, config.secret, async (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).send({ message: "Unauthorized!" });
      }
      const User = await db.user.findById(decoded.id);
      if (User) {
        req.userId = decoded.id;
        req.firstName = decoded.firstName;
        req.userIp = decoded.ip;
        next();
      } else {
        console.log("error");
        return res.status(401).send({ message: "Unauthorized!" });
      }
    });
  } catch (error) {
    return error;
  }
};

const authJwt = {
  verifyToken,
};
module.exports = authJwt;
