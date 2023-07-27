const { authJwt } = require("../middleware");
const regimentController = require("../controllers/regiment.controller");

module.exports = function (app) {
  // CORS
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /**
   * ROUTES
   */

  app.get(
    "/pa/regiments/",
    regimentController.findAll
  );

  // Get Routes

  app.get(
    "/pa/regiments/:regimentId",
    regimentController.findOne
  );

  app.get(
    "/pa/regiments/:regimentId/users",
    regimentController.findUsersByRegimentId
  );

  app.get(
    "/pa/regiments/:regimentId/gameids",
    regimentController.findGameIdsByRegimentId
  );

  // find users regiment by game id
  app.get(
    "/pa/regiments/gameid/:gameId",
    regimentController.findRegimentByGameId
  );

  // Post Routes
  app.put(
    "/pa/regiments/:regimentId/update",
    [authJwt.verifyRegiment],
    regimentController.update
  );

  app.put(
    "/pa/regiments/:regimentId/change",
    [authJwt.verifyDomainAndPath],
    regimentController.update
  )

  app.post(
    "/pa/regiments/create",
    regimentController.createRegiment
  )

  app.post(
    "/pa/regiments/:regimentId/gameid",
    regimentController.addGameId
  )

  // Delete Routes

  app.delete(
    "/pa/regiments/:userId/remove",
    regimentController.removeUsersRegiment
  );


  app.delete(
    "/pa/regiments/:regimentId/gameid/:gameId",
    regimentController.removeGameId
  );

  
};
