const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");

console.log("AUTH ROUTES:", typeof authRoutes);
console.log("JOB ROUTES:", typeof jobRoutes);
console.log("APPLICATION ROUTES:", typeof applicationRoutes);
console.log("SAVED JOB ROUTES:", typeof savedJobRoutes);

const app = express();

// ===============================
// DATABASE
// ===============================

connectDB();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// STATIC FILES
// ===============================

// Serve uploaded resumes and other uploaded files
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// ===============================
// ROUTES
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved-jobs", savedJobRoutes);

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "HireFlow API is running 🚀",
    });
});

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`HireFlow server running on port ${PORT}`);
});