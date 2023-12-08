/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\weapon.routes.js
 * Project: c:\Users\tonyw\Desktop\WoRApi\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Thu December 7th 2023 5:47:25 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const { authJwt } = require("../middleware");
const weapon = require("../controllers/weapon.controller");

/**
 * Weapon Routes
 * @param {*} app 
 */
module.exports = function (app) {
  // CORS
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  // ! Get Routes //

  /**
   * Get All Weapons
   * @route GET /v2/weapons/
   * @group Weapons
   * @returns {object} 200 - An object containing the weapons
   */
  app.get("/v2/weapons/", weapon.findAll);

  /**
   * Get Weapon By ID
   * @route GET /v2/weapons/:id
   * @group Weapons
   * @returns {object} 200 - An object containing the weapon
   */
  app.get("/v2/weapons/:id", weapon.findOne);

  // ! Post Routes //

  /**
   * Create or Update Weapon
   * @route POST /v2/weapons/weapon/:weaponId
   * @group Weapons
   * @returns {object} 200 - An object containing the weapon
   */
  app.post(
    "/v2/weapons/weapon/:weaponId",
    [authJwt.verifyToken, authJwt.isAdmin],
    weapon.createOrUpdateWeapon
  );

  // ! Delete Routes //

  /**
   * Delete Weapon
   * @route DELETE /v2/weapons/weapon/:weaponId
   * @group Weapons
   * @returns {object} 200 - An object containing the weapon
   */
  app.delete(
    "/v2/weapons/weapon/:weaponId",
    [authJwt.verifyToken, authJwt.isAdmin],
    weapon.deleteWeapon
  );
};
