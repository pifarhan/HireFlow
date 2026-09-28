const express = require("express");

const {
    saveJob,
    getSavedJobs,
    removeSavedJob,
} = require("../controllers/savedJobController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Save a job
router.post(
    "/:jobId",
    protect,
    roleMiddleware("student"),
    saveJob
);

// Get saved jobs
router.get(
    "/",
    protect,
    roleMiddleware("student"),
    getSavedJobs
);

// Remove saved job
router.delete(
    "/:jobId",
    protect,
    roleMiddleware("student"),
    removeSavedJob
);

module.exports = router;