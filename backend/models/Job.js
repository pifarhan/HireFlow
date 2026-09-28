const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        company: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        requirements: {
            type: [String],
            default: [],
        },

        skills: {
            type: [String],
            default: [],
        },

        salary: {
            type: String,
            default: "Not disclosed",
        },

        location: {
            type: String,
            required: true,
        },

        jobType: {
            type: String,
            enum: [
                "Full Time",
                "Part Time",
                "Internship",
                "Contract",
            ],
            default: "Full Time",
        },

        status: {
            type: String,
            enum: ["Active", "Closed"],
            default: "Active",
        },

        experience: {
            type: String,
            default: "Fresher",
        },

        deadline: {
            type: Date,
            required: true,
        },

        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Job", jobSchema);