const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const app = express();

/**
 *   Cross Origin Resource Sharing
 * ! Domain Whitelist
 */
app.use(cors({
  origin: ['http://localhost:4200', 'https://discord.com', 'https://wortool.com'],
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('json spaces', 2)

db.sequelize.sync();

// Main API Route
app.get("/wor", (req, res) => {
  res.json({ message: "WoRTool Beta API." });
});


// Application Routes
require("./app/routes/map.routes")(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/weapon.routes')(app);
require('./app/routes/note.routes')(app);
require('./app/routes/favorite.routes')(app);
require('./app/routes/discord.routes')(app);
require('./app/routes/steam.routes')(app);
require('./app/routes/regiment.routes')(app);
require('./app/routes/wor.routes')(app);
require('./app/routes/muster.user.routes')(app);


const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
