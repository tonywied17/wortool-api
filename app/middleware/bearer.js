
const db = require("../models");
const User = db.User;
require("dotenv").config({ path: "/home/paarmy/envs/wor/.env" });

const checkBearerToken = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
  
    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Unauthorized. Bearer token missing.' });
    }
  
    const token = authorizationHeader.replace('Bearer ', '');
  
    if (token !== process.env.AUTH_SECRET) {
      return res.status(403).json({ message: 'Forbidden. Invalid Bearer token.' });
    }
  
    // If the token is valid, you can proceed to the controller
    next();
  };

  const authJwt = {
    checkBearerToken: checkBearerToken,
  };
  module.exports = checkBearerToken;