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
      attributes: { exclude: ['password'] },
    });

    const usersWithRoles = [];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const roles = await user.getRoles();
      let authorities = [];

      for (let j = 0; j < roles.length; j++) {
        authorities.push("ROLE_" + roles[j].name.toUpperCase());
      }

      usersWithRoles.push({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        discordId: user.discordId,
        regimentId: user.regimentId,
        roles: authorities,
      });
    }

    return res.status(200).json(usersWithRoles);
  } catch (err) {
    console.error("Error retrieving regiment:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.update = async (req, res) => {
  const id = req.params.regimentId;

  console.log(req.body)

  try {
    const regiment = await Regiment.findByPk(id);

    if (!regiment) {
      return res.status(404).json({ error: "Regiment not found" });
    }

    const updatedRegiment = await regiment.update(req.body);

    return res.status(200).json(updatedRegiment);
  } catch (error) {
    console.error("Error updating regiment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


exports.createRegiment = async (req, res) => {
  const guildId = req.body.guildId;
  const guildName = req.body.guildName;
  const guildAvatar = req.body.guildAvatar;
  const guildInvite = req.body.guildInvite;
  const ownerId = req.body.ownerId;
  const side = req.body.side;

  try {
    let regiment = await Regiment.findOne({ where: { guild_id: guildId } });

    if (regiment) {
      // Guild ID already exists, update the record
      regiment = await Regiment.update(
        {
          regiment: guildName,
          guild_avatar: guildAvatar,
          invite_link: guildInvite,
          ownerId: ownerId,
          side: side,
        },
        { where: { guild_id: guildId } }
      );
    } else {
      // Guild ID doesn't exist, create a new record
      regiment = await Regiment.create({
        guild_id: guildId,
        regiment: guildName,
        guild_avatar: guildAvatar,
        invite_link: guildInvite,
        ownerId: ownerId,
        side: side,
      });
    }

    // Get the newly created/updated regiment's ID
    const regimentId = regiment.id;

    // Update the user's regimentId column
    await User.update({ regimentId: regimentId }, { where: { discordId: ownerId } });

    // Find the user
    const user = await User.findOne({ where: { discordId: ownerId } });

    if (!user) {
      return res.status(404).send({ message: "User ID Not found. Please sync your discord account before adding a regiment." });
    }

    // Get the user's roles
    let roles = await user.getRoles();

    // Check if role 2 is already present in the roles array
    const hasRole2 = roles.some(role => role.id === 2);

    // Add role 2 to the updated roles if it's not already present
    if (!hasRole2) {
      roles.push(2);
    }

    // Update the user's roles
    await user.setRoles(roles);

    return res.status(200).json({ regimentId: regimentId, message: "User roles updated successfully!" });
  } catch (error) {
    console.error("Error creating/updating regiment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.removeUsersRegiment = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.getRoles().then(async (roles) => {
      const hasRole2 = roles.some(role => role.id === 2);

      if (hasRole2) {
        const updatedRoles = roles.filter(role => role.id !== 2);
        await user.setRoles(updatedRoles);
      }

      const updatedUser = await user.update({ regimentId: null });
      return res.status(200).json(updatedUser);
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


