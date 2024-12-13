const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  name: String,
  status: String,
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vehicle", VehicleSchema);
