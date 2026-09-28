const express = require("express");

const {
    createJob,
    getJobs,
    getMyJobs,
    getJobById,
    updateJob,
    deleteJob,
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// ===============================
// PUBLIC ROUTES
// ===============================

// Get all jobs
router.get("/", getJobs);

// Get a single job
router.get("/:id", getJobById);


// ===============================
// RECRUITER ROUTES
// ===============================

// Get recruiter's own jobs
router.get(
    "/recruiter/my",
    protect,
    roleMiddleware("recruiter"),
    getMyJobs
);

// Create a new job
router.post(
    "/",
    protect,
    roleMiddleware("recruiter"),
    createJob
);

// Update a job
router.put(
    "/:id",
    protect,
    roleMiddleware("recruiter"),
    updateJob
);

// Delete a job
router.delete(
    "/:id",
    protect,
    roleMiddleware("recruiter"),
    deleteJob
);

module.exports = router;