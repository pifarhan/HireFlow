const Job = require("../models/Job");

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Recruiter
const createJob = async (req, res) => {
    try {
        const {
            title,
            company,
            description,
            requirements,
            skills,
            salary,
            location,
            jobType,
            experience,
            deadline,
        } = req.body;

        // Use recruiter's registered company
        const recruiterCompany = req.user.company || company;

        // Validate required fields
        if (
            !title ||
            !recruiterCompany ||
            !description ||
            !location ||
            !deadline
        ) {
            return res.status(400).json({
                message:
                    "Title, company, description, location and deadline are required",
            });
        }

        const job = await Job.create({
            title,
            company: recruiterCompany,
            description,
            requirements: requirements || [],
            skills: skills || [],
            salary: salary || "Not disclosed",
            location,
            jobType: jobType || "Full Time",
            experience: experience || "Fresher",
            deadline,
            recruiter: req.user._id,
        });

        res.status(201).json({
            message: "Job created successfully",
            job,
        });
    } catch (error) {
        console.error("Create Job Error:", error.message);

        res.status(500).json({
            message: "Server error while creating job",
        });
    }
};


// @desc    Get all jobs with search and filters
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
         const {
    search,
    location,
    jobType,
    skills,
    status,
    page = 1,
    limit = 10,
} = req.query;

        const filter = {};

        // Search by job title or company
        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    company: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        // Location filter
        if (location) {
            filter.location = {
                $regex: location,
                $options: "i",
            };
        }

        // Job type filter
        if (jobType) {
            filter.jobType = jobType;
        }

        // Skills filter
        if (skills) {
            const skillList = skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean);

            if (skillList.length > 0) {
                filter.skills = {
                    $in: skillList,
                };
            }
        }

        // Show active jobs by default
        filter.status = status || "Active";

        const skip = (Number(page) - 1) * Number(limit);
        const totalJobs = await Job.countDocuments(filter);

        const jobs = await Job.find(filter)
    .populate(
        "recruiter",
        "name email company"
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

      res.status(200).json({
    count: jobs.length,
    total: totalJobs,
    page: Number(page),
    pages: Math.ceil(totalJobs / Number(limit)),
    jobs,
});

        
    } catch (error) {
        console.error("Get Jobs Error:", error.message);

        res.status(500).json({
            message: "Server error while fetching jobs",
        });
    }
};

// @desc    Get jobs created by logged-in recruiter
// @route   GET /api/jobs/recruiter/my
// @access  Recruiter
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            recruiter: req.user._id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            count: jobs.length,
            jobs,
        });
    } catch (error) {
        console.error("Get My Jobs Error:", error.message);

        res.status(500).json({
            message: "Server error while fetching recruiter jobs",
        });
    }
};


// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate(
            "recruiter",
            "name email company"
        );

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        res.status(200).json({
            job,
        });
    } catch (error) {
        console.error("Get Job Error:", error.message);

        res.status(500).json({
            message: "Server error while fetching job",
        });
    }
};


// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Recruiter
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        // Only the recruiter who created the job can update it
        if (
            job.recruiter.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Not authorized to update this job",
            });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob,
        });
    } catch (error) {
        console.error("Update Job Error:", error.message);

        res.status(500).json({
            message: "Server error while updating job",
        });
    }
};


// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Recruiter
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        // Only the recruiter who created the job can delete it
        if (
            job.recruiter.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Not authorized to delete this job",
            });
        }

        await job.deleteOne();

        res.status(200).json({
            message: "Job deleted successfully",
        });
    } catch (error) {
        console.error("Delete Job Error:", error.message);

        res.status(500).json({
            message: "Server error while deleting job",
        });
    }
};


module.exports = {
    createJob,
    getJobs,
    getMyJobs,
    getJobById,
    updateJob,
    deleteJob,
};