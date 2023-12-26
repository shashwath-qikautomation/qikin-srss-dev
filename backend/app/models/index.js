const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.user = require("../models/user/user.model.js")(mongoose);
db.inventory = require("../models/inventory.model.js")(mongoose);
db.bom = require("../models/bom.model.js")(mongoose);
db.workOrder = require("../models/workOrder.model.js")(mongoose);
db.role = require("../models/role.model.js")(mongoose);
db.purchase = require("../models/purchase.model.js")(mongoose);
db.vendor = require("../models/vendor.model.js")(mongoose);

module.exports = db;
