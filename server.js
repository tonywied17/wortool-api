const express = require("express");
const cors = require("cors");

const app = express();




// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.set('json spaces', 2)

const db = require("./app/models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/pa", (req, res) => {
  res.json({ message: "Pennsylvania Army API." });
});

require("./app/routes/map.routes")(app);
require("./app/routes/gallery.routes")(app);
require("./app/routes/eu.routes")(app);
require("./app/routes/us.routes")(app);
require("./app/routes/score.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
