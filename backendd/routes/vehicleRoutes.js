const express = require("express");
const Vehicle = require("../modules/Vehicle");
const router = express.Router();

router.post("/api/vehicles", async (req, res) => {
  const { name, status } = req.body;
  try {
    const newVehicle = new Vehicle({ name, status });
    await newVehicle.save();
    res.status(201).json({ message: "Vehicle added successfully!" });
  } catch (err) {
    res.status(400).json({ message: "Error adding vehicle: " + err });
  }
});

// Get All Vehicles
router.get("/api/vehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
});

// Update Vehicle Status
router.put("/api/vehicles/:id", async (req, res) => {
  const { status } = req.body;
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status, lastUpdated: new Date() },
      { new: true }
    );
    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ message: "Error updating vehicle: " + err });
  }
});

module.exports = router;
