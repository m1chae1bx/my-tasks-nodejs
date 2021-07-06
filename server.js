// Initialize express application
const express = require("express");
const app = express();
app.use(express.json()); // parse requests of content-type - application/json
app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

// Configure origin from which requests are permitted using cors
var corsOptions = {
  origin: "http://localhost:4200"
};
const cors = require("cors");
app.use(cors(corsOptions)); 

// Connect to database
const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log("Connected to the database!"))
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// Configure passport for authentication
var passport = require('./app/config/passport.config');
app.use(passport.initialize());

// Configure API routes
app.get("/", res => res.json({ message: "Si Hesus ay Panginoon at Tagapagligtas!" }));
require("./app/routes/tasks.routes")(app);
require("./app/routes/auth.routes")(app);

// Implement error handling for UnauthorizedError
app.use(function(err, res) {
  if (err.name = "UnauthorizedError") {
    res.status(401);
    res.json({ "message": err.name });
  }
});

// Set port and start listening for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));