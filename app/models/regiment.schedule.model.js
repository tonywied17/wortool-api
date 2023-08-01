/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\regschedule.model.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday August 1st 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Tue August 1st 2023 11:45:42 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Regiment Schedule Model
 * This model represents the Regiment Schedule Table in the database.
 * 
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
    const RegSchedule = sequelize.define("RegSchedules", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        regimentId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        day: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        time: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        event_type: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        event_name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    });

    /**
     * Associate Regiment Schedule with Regiment
     * @param {*} models 
     */
    RegSchedule.associate = (models) => {
        RegSchedule.belongsTo(models.Regiment, {
            foreignKey: "regimentId",
            onDelete: "CASCADE",
        });
    };

    return RegSchedule;
};

/**
 * Update Current Regiment Schedule
 * This function updates the current Regiment Schedule.
 * @param {*} req - Request containing the updated Regiment Schedule data in the body
 * @param {*} res - Response containing the updated Regiment Schedule data
 */
exports.updateSchedule = (req, res) => {
    const id = req.params.id;

    RegSchedule.update(req.body, {
            where: {
                id: id,
            },
        })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Schedule was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Schedule with id=${id}. Maybe Schedule was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating Schedule with id=" + id,
            });
        });
}