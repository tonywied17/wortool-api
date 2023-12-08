/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\note.controller.js
 * Project: c:\Users\tonyw\Desktop\WoRApi\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Thu December 7th 2023 5:27:57 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const db = require("../models");
const Note = db.Note;

/**
 * Find all notes for a specific user and map
 * This function is used to retrieve all notes for a specific user and map
 * @param {*} req - request containing the userId and mapId
 * @param {*} res - response containing the notes
 */
exports.findNotesByUserAndMap = (req, res) => {
  const userId = req.params.userId;
  const mapId = req.params.mapId;

  Note.findAll({
    where: {
      userId: userId,
      mapId: mapId,
    },
  })
    .then((notes) => {
      console.log("notes: " + notes);
      res.send(notes);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes.",
      });
    });
};

/**
 * Create or update a note
 * This function is used to create or update a note
 * 
 * @param {*} req - request containing the userId, mapId, and note
 * @param {*} res - response containing the note
 */
exports.createOrUpdateNote = (req, res) => {
  const userId = req.params.userId;
  const mapId = req.params.mapId;
  const noteText = req.body.note;

  Note.findOne({
    where: {
      userId: userId,
      mapId: mapId,
    },
  })
    .then((note) => {
      if (note) {
        note.note = noteText;
        note
          .save()
          .then((updatedNote) => {
            res.send(updatedNote);
          })
          .catch((err) => {
            res.status(500).send({
              message: "Failed to update the note.",
            });
          });
      } else {
        Note.create({
          userId: userId,
          mapId: mapId,
          note: noteText,
        })
          .then((createdNote) => {
            res.send(createdNote);
          })
          .catch((err) => {
            res.status(500).send({
              message: "Failed to create the note.",
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Some error occurred while retrieving notes.",
      });
    });
};
