const Application = require("../models/Application");
const Job = require("../models/Job");

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Student
const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        if (new Date(job.deadline) < new Date()) {
            return res.status(400).json({
                message: "Application deadline has passed",
            });
        }

        const existingApplication = await Application.findOne({
            job: jobId,
            student: req.user._id,
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
            });
        }

        const application = await Application.create({
            job: jobId,
            student: req.user._id,
            resume: req.user.resume || "",
        });

        const populatedApplication = await Application.findById(
            application._id
        )
            .populate("job")
            .populate("student", "name email");

        res.status(201).json({
            message: "Application submitted successfully",
            application: populatedApplication,
        });
    } catch (error) {
        console.error("Apply Job Error:", error.message);

        res.status(500).json({
            message: "Server error while applying for job",
        });
    }
};

// @desc    Get logged-in student's applications
// @route   GET /api/applications/my
// @access  Student
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            student: req.user._id,
        })
            .populate(
                "job",
                "title company location salary jobType deadline"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: applications.length,
            applications,
        });
    } catch (error) {
        console.error("Get My Applications Error:", error.message);

        res.status(500).json({
            message: "Server error while fetching applications",
        });
    }
};

// @desc    Get applications for recruiter's jobs
// @route   GET /api/applications/recruiter
// @access  Recruiter
const getRecruiterApplications = async (req, res) => {
    try {
        const jobs = await Job.find({
            recruiter: req.user._id,
        }).select("_id");

        const jobIds = jobs.map((job) => job._id);

        const applications = await Application.find({
            job: { $in: jobIds },
        })
            .populate(
                "job",
                "title company location jobType"
            )
            .populate(
                "student",
                "name email phone location skills education resume"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: applications.length,
            applications,
        });
    } catch (error) {
        console.error(
            "Get Recruiter Applications Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while fetching recruiter applications",
        });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Recruiter
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Applied",
            "Under Review",
            "Shortlisted",
            "Interview",
            "Selected",
            "Rejected",
        ];

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status",
            });
        }

        const application = await Application.findById(
            req.params.id
        ).populate("job");

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        // Make sure the recruiter owns the job
        if (
            application.job.recruiter.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message:
                    "Not authorized to update this application",
            });
        }

        application.status = status;

        await application.save();

        const updatedApplication =
            await Application.findById(application._id)
                .populate(
                    "job",
                    "title company location jobType"
                )
                .populate(
                    "student",
                    "name email phone location skills education resume"
                );

        res.status(200).json({
            message: "Application status updated successfully",
            application: updatedApplication,
        });
    } catch (error) {
        console.error(
            "Update Application Status Error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while updating application status",
        });
    }
};

module.exports = {
    applyForJob,
    getMyApplications,
    getRecruiterApplications,
    updateApplicationStatus,
};