const express = require("express");
const session = require('express-session');
const cors = require("cors");
const db = require("./app/models");
const app = express();
const passport = require('passport');
require('./app/config/passport');

/**
 *   Cross Origin Resource Sharing
 * ! Domain Whitelist
 */
app.use(cors({
  origin: ['http://localhost:4200', 'https://discord.com', 'https://wortool.com'],
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

app.use(session({
  secret: process.env.AUTH_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('json spaces', 0)

db.sequelize.sync();

// Main API Route
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'tmp/restart.txt');
let dateModified = fs.statSync(filePath).mtime;

app.get("/v2", (req, res) => {
  res.json({ 
    message: "WoRTool Beta Version 2.",
    last_restart: dateModified 
  });
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
