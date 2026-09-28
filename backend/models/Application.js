const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        resume: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: [
                "Applied",
                "Under Review",
                "Shortlisted",
                "Interview",
                "Selected",
                "Rejected",
            ],
            default: "Applied",
        },

        appliedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent a student from applying to the same job multiple times
applicationSchema.index(
    { job: 1, student: 1 },
    { unique: true }
);

module.exports = mongoose.model("Application", applicationSchema);