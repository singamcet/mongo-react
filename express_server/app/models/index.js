const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.product = require("./product.model.js")(mongoose);
db.users = require("./users.model.js")(mongoose);
db.orders = require("./orders.model.js")(mongoose);

module.exports = db;
