const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.Task = require("./task.model.js")(mongoose);
db.User = require("./user.model.js")(mongoose);
db.List = require("./list.model.js")(mongoose);

module.exports = db;