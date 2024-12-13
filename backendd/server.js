const express = require("express");
const mongoose = require("mongoose");
const vehicleRoutes = require("./routes/vehicleRoutes");
const cors = require("cors");
require("dotenv").config();
const app = express();

const PORT = 5000;
const mongoURI = process.env.MONGO_URI;
// Middleware
app.use(express.json());
app.use(cors());
app.use(express.json());
// MongoDB Connection
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/vehicles", vehicleRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
