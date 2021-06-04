const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require('passport');

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

const passportConfig = require('./app/config/passport.config');
app.use(passport.initialize());

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Jesus is Lord and Savior." });
});

require("./app/routes/tasks.routes")(app);
require("./app/routes/auth.routes")(app);

app.use(function(err, req, res, next) {
    if (err.name = "UnauthorizedError") {
        res.status(401);
        res.json({"message": err.name + ": " + err.message});
    }
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});