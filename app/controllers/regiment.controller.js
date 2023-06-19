const db = require("../models");
const Regiment = db.regiment;
const User = db.user;



exports.findAll = async (req, res) => {
  try {

    const regiments = await Regiment.findAll();

    return res.status(200).json(regiments);
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving regiments:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.regimentId;

  try {
    const regiment = await Regiment.findByPk(id);

    if (!regiment) {
      return res.status(404).json({ error: "Regiment not found" });
    }

    return res.status(200).json(regiment);
  } catch (error) {
    console.error("Error retrieving regiment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.findUsersByRegimentId = async (req, res) => {
  const regimentId = req.params.regimentId;

  try {
    const users = await User.findAll({
      where: {
        regimentId: regimentId,
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

