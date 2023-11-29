/**
 * Muster Routes
 * @param {*} app 
 */
module.exports = (app) => {
    const musterUserController = require("../controllers/muster.user.controller.js");
    const router = require("express").Router();
  
    // Get All Muster Users
    /**
     * Get All Muster Users
     * @route GET /pa/musteruser
     * @group MusterUser
     * @returns {object} 200 - An object containing the Muster User items
     */
    router.get("/reg/:regimentId", musterUserController.findAll);
    router.get("/discord/:guildId", musterUserController.findAllByGuild);

    // Get Muster User By Discord ID
    /**
     * Get Muster User By Discord ID
     * @route GET /pa/musteruser/:discordId
     * @group MusterUser
     * @returns {object} 200 - An object containing the Muster User item
     */
    router.get("/reg/:regimentId/user/:discordId", musterUserController.findOne);

    // Update Muster User By Discord ID
    /**
     * Update Muster User By Discord ID
     * @route PUT /pa/musteruser/:discordId
     * @group MusterUser
     * @returns {object} 200 - Success message
     */
    router.put("/update", musterUserController.update);

    // Create Muster User
    /**
     * Create Muster User
     * @route POST /pa/musteruser
     * @group MusterUser
     * @returns {object} 200 - An object containing the created Muster User item
     */
    router.post("/create", musterUserController.create);
    
    router.put("/discord/increase/", musterUserController.updateAll);

    router.put("/incr-events", musterUserController.incrementEvents);
    router.put("/incr-drills", musterUserController.incrementDrills);
  
    app.use("/pa/musteruser", router);
};
