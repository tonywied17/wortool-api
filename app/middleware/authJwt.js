const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyDomainAndPath = (req, res, next) => {
  const allowedDomains = [
    "https://wortool.com/regiments",
    "http://localhost:4200/regiments",
    "https://app.paarmy.com/regiments",
  ];

  const requestedDomain = req.headers['x-requested-domain'];

  console.log("Requesting from:", requestedDomain);

  if (allowedDomains.includes(requestedDomain)) {
    console.log("Domain approved:", requestedDomain);
    next();
  } else {
    console.log("Unauthorized domain:", requestedDomain);
    res.status(403).send({
      message: "Unauthorized domain!",
    });
  }
}




verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }

    console.log(decoded.id + " " + req.params.userId);
    console.log(decoded.id + " " + req.body.userId);

    if (req.params.userId && decoded.id == req.params.userId) {
      console.log("PARAMS: " + req.params.userId + " " + decoded.id);
      req.body.userId = decoded.id;
      next();
      return;
    }

    if (req.body.userId && decoded.id == req.body.userId) {
      console.log("BODY: " + req.body.userId + " " + decoded.id);
      req.body.userId = decoded.id;
      next();
      return;
    }

    return res.status(401).send({
      message: "Unauthorized!",
    });
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.body.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!",
      });
      return;
    });
  });
};

isModerator = (req, res, next) => {



  console.log("isModerator 1");
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  console.log("isModerator 2");

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }

    console.log(decoded.regimentId + " " + req.body.regimentId);
    console.log(decoded.id + " " + req.body.userId);

    console.log("isModerator 3");

    User.findByPk(req.body.userId).then((user) => {
      user.getRoles().then((roles) => {
        let isModerator = false;

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            isModerator = true;
            break;
          }
        }

        console.log("isModerator 4");

        if (!isModerator) {
          return res.status(403).send({
            message: "Require Moderator Role!",
          });
        }

        console.log("isModerator 5" + decoded.regimentId);


        if (req.body.regimentId && decoded.regimentId == req.body.regimentId) {
          console.log("Regiment ID: " + req.body.regimentId + " " + decoded.regimentId);
          req.body.regimentId = decoded.regimentId;
          next();
        } else {
          return res.status(401).send({
            message: "Unauthorized!",
          });
        }
      });
    }).catch((err) => {
      return res.status(500).send({
        message: "Internal Server Error",
        error: err,
      });
    });
  });
};






isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.body.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Moderator or Admin Role!",
      });
    });
  });
};

verifyRegiment = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }

    console.log(decoded.regimentId + " " + req.params.regimentId);
    console.log(decoded.regimentId + " " + req.body.regimentId);

    if (req.params.regimentId && decoded.regimentId == req.params.regimentId) {
      console.log("PARAMS: " + req.params.regimentId + " " + decoded.regimentId);
      req.body.regimentId = decoded.regimentId;
      next();
      return;
    }

    if (req.body.regimentId && decoded.regimentId == req.body.regimentId) {
      console.log("BODY: " + req.body.regimentId + " " + decoded.regimentId);
      req.body.regimentId = decoded.regimentId;
      next();
      return;
    }

    return res.status(401).send({
      message: "Unauthorized!",
    });
  });
};


const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin,
  verifyRegiment: verifyRegiment,
  verifyDomainAndPath: verifyDomainAndPath,
};
module.exports = authJwt;