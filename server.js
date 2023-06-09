const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: ['https://paarmy.com', 'https://app.paarmy.com', 'https://www.paarmy.com', 'http://localhost:4200', 'https://paapp.tbz.wtf'],
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.set('json spaces', 2)

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();
// when i deploy it remember:
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

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


const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}