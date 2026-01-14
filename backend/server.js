// 🔥 STEP 1: dotenv SABSE UPAR
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

// 🔥 STEP 2: DB connect (env ab available hai)
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/appointments", appointmentRoutes);
app.use("/api/patients", patientRoutes);

app.get("/", (req, res) => {
  res.send("Hospital Management API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
