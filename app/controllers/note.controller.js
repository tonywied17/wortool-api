const db = require('../models');
const Note = db.note;

exports.findNotesByUserAndMap = (req, res) => {
  const userId = req.params.userId;
  const mapId = req.params.mapId;

  Note.findAll({
    where: {
      userId: userId,
      mapId: mapId
    }
  })
    .then(notes => {
      console.log('notes: ' + notes);
      res.send(notes);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving notes.'
      });
    });
};

exports.createOrUpdateNote = (req, res) => {
  const userId = req.params.userId;
  const mapId = req.params.mapId;
  const noteText = req.body.note;
  
  console.log('userId: ' + userId);
  console.log('mapId: ' + mapId);
  console.log('noteText: ' + noteText);
  Note.findOne({
    where: {
      userId: userId,
      mapId: mapId
    }
  })
    .then(note => {
      if (note) {
        note.note = noteText;
        note.save()
          .then(updatedNote => {
            res.send(updatedNote);
          })
          .catch(err => {
            res.status(500).send({
              message: 'Failed to update the note.'
            });
          });
      } else {
        Note.create({
          userId: userId,
          mapId: mapId,
          note: noteText
        })
          .then(createdNote => {
            res.send(createdNote);
          })
          .catch(err => {
            res.status(500).send({
              message: 'Failed to create the note.'
            });
          });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Some error occurred while retrieving notes.'
      });
    });
};
