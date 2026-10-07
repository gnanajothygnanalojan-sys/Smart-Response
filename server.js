const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const emergencyReportRoutes = require("./routes/emergencyReportRoutes");
const emergencyTypeRoutes = require("./routes/emergencyTypeRoutes");
const emergencyContactRoutes = require("./routes/emergencyContactRoutes");
const responderRoutes = require("./routes/responderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");


dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Smart Response API is running"
    });
});

// User routes
app.use("/api/users", userRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/emergency-reports", emergencyReportRoutes);
app.use("/api/emergency-types", emergencyTypeRoutes);
app.use("/api/emergency-contacts", emergencyContactRoutes);
app.use("/api/responders", responderRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});