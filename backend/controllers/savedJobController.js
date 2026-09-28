const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");

// Save a job
const saveJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        const existingSavedJob = await SavedJob.findOne({
            student: req.user._id,
            job: jobId,
        });

        if (existingSavedJob) {
            return res.status(400).json({
                message: "Job already saved",
            });
        }

        const savedJob = await SavedJob.create({
            student: req.user._id,
            job: jobId,
        });

        res.status(201).json({
            message: "Job saved successfully",
            savedJob,
        });
    } catch (error) {
        console.error("Save Job Error:", error.message);

        res.status(500).json({
            message: "Server error while saving job",
        });
    }
};


// Get student's saved jobs
const getSavedJobs = async (req, res) => {
    try {
        const savedJobs = await SavedJob.find({
            student: req.user._id,
        })
            .populate(
                "job",
                "title company description skills salary location jobType experience deadline status"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: savedJobs.length,
            savedJobs,
        });
    } catch (error) {
        console.error(
            "Get Saved Jobs Error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while fetching saved jobs",
        });
    }
};


// Remove a saved job
const removeSavedJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        const savedJob = await SavedJob.findOneAndDelete({
            student: req.user._id,
            job: jobId,
        });

        if (!savedJob) {
            return res.status(404).json({
                message: "Saved job not found",
            });
        }

        res.status(200).json({
            message: "Job removed from saved jobs",
        });
    } catch (error) {
        console.error(
            "Remove Saved Job Error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while removing saved job",
        });
    }
};


module.exports = {
    saveJob,
    getSavedJobs,
    removeSavedJob,
};