const express = require("express");

const {
    applyForJob,
    getMyApplications,
    getRecruiterApplications,
    updateApplicationStatus,
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Student applies for a job
router.post(
    "/:jobId",
    protect,
    roleMiddleware("student"),
    applyForJob
);

// Student views their applications
router.get(
    "/my",
    protect,
    roleMiddleware("student"),
    getMyApplications
);

// Recruiter views applications for their jobs
router.get(
    "/recruiter",
    protect,
    roleMiddleware("recruiter"),
    getRecruiterApplications
);

// Recruiter updates application status
router.put(
    "/:id/status",
    protect,
    roleMiddleware("recruiter"),
    updateApplicationStatus
);

module.exports = router;