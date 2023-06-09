const db = require('../models');
const Favorite = db.favorite;
const Op = db.Sequelize.Op;

// Find favorites for a specific user and map
exports.findFavoritesByUserAndMap = (req, res) => {
    const userId = req.params.userId;
    const mapId = req.params.mapId;

    Favorite.findAll({
        where: {
            userId: userId,
            mapId: mapId
        }
    })
        .then(favorites => {
            console.log('favorites: ' + favorites);
            res.send(favorites);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving favorites.'
            });
        });
}

// Create or update a favorite for a specific user and map
exports.createOrUpdateFavorite = (req, res) => {
    const route = req.body.route;
    const userId = req.params.userId;
    const mapId = req.params.mapId;
    const type = req.body.type;

    console.log('userId: ' + userId);
    console.log('mapId: ' + mapId);
    console.log('type: ' + type);

    Favorite.findOne({
        where: {
            userId: userId,
            mapId: mapId
        }
    })
        .then(favorite => {
            if (favorite) {
                console.log('existing favorite: ' + favorite);
                // Favorite exists, update it
                favorite.favorite = type;
                favorite.save()
                    .then(updatedFavorite => {
                        res.send(updatedFavorite);
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: 'Failed to update the favorite.'
                        });
                    });
            } else {
                // Favorite doesn't exist, create it
                Favorite.create({
                    route: route,
                    userId: userId,
                    mapId: mapId,
                    type: type
                })
                    .then(newFavorite => {
                        res.send(newFavorite);
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: 'Failed to create the favorite.'
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'Failed to find the favorite.'
            });
        });
}

// Find favorites for a specific user
exports.findFavoritesByUser = (req, res) => {
    const userId = req.params.userId;

    Favorite.findAll({
        where: {
            userId: userId
        }
    })
        .then(favorites => {
            console.log('favorites: ' + favorites);
            res.send(favorites);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving favorites.'
            });
        });
}


// Find favorites for a specific map
exports.findFavoritesByMap = (req, res) => {
    const mapId = req.params.mapId;

    Favorite.findAll({
        where: {
            mapId: mapId,
            type: 'map'
        }
    })
        .then(favorites => {
            console.log('favorites: ' + favorites);
            res.send(favorites);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving favorites.'
            });
        });
}


// Delete a favorite for a specific user and map
exports.deleteFavorite = (req, res) => {
    const userId = req.params.userId;
    const mapId = req.params.mapId;

    Favorite.destroy({
        where: {
            userId: userId,
            mapId: mapId
        }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: 'Favorite was deleted successfully.'
                });
            } else {
                res.send({
                    message: `Cannot delete Favorite with userId=${userId} and mapId=${mapId}. Maybe Favorite was not found.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'Could not delete Favorite with userId=' + userId + ' and mapId=' + mapId
            });
        });
}