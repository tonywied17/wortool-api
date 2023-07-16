const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const app = express();

app.use(cors({
  origin: ['https://paarmy.com', 'https://app.paarmy.com', 'https://www.paarmy.com', 'https://paapp.tbz.wtf', 'https://discord.com', 'https://wortool.com'],
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('json spaces', 2)

db.sequelize.sync();

app.get("/pa", (req, res) => {
  res.json({ message: "Pennsylvania Army API." });
});


/**
 * ROUTES
 * 
 * REST API ROUTES
 * 
 */
require("./app/routes/map.routes")(app);
require("./app/routes/gallery.routes")(app);
require("./app/routes/eu.routes")(app);
require("./app/routes/us.routes")(app);
require("./app/routes/score.routes")(app);
require("./app/routes/muster.routes")(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/weapon.routes')(app);
require('./app/routes/note.routes')(app);
require('./app/routes/favorite.routes')(app);
require('./app/routes/discord.routes')(app);
require('./app/routes/steam.routes')(app);
require('./app/routes/regiment.routes')(app);
require('./app/routes/wor.routes')(app);


const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
