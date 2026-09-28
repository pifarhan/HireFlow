const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            phone,
            location,
            skills,
            education,
            company,
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "student",
            phone: phone || "",
            location: location || "",
            skills: skills || [],
            education: education || "",
            company: company || "",
        });

        res.status(201).json({
            message: "User registered successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },

            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(
            "Registration Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error during registration",
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Email and password are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        res.status(200).json({
            message: "Login successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },

            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(
            "Login Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error during login",
        });
    }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
    try {
        res.status(200).json({
            user: req.user,
        });
    } catch (error) {
        console.error(
            "Get User Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error",
        });
    }
};

// @desc    Update current user's profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const {
            name,
            phone,
            location,
            skills,
            education,
            resume,
            company,
        } = req.body;

        if (name !== undefined) {
            user.name = name.trim();
        }

        if (phone !== undefined) {
            user.phone = phone.trim();
        }

        if (location !== undefined) {
            user.location = location.trim();
        }

        if (skills !== undefined) {
            user.skills = Array.isArray(skills)
                ? skills
                : [];
        }

        if (education !== undefined) {
            user.education = education.trim();
        }

        if (resume !== undefined) {
            user.resume = resume.trim();
        }

        if (company !== undefined) {
            user.company = company.trim();
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile updated successfully",

            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                location: updatedUser.location,
                skills: updatedUser.skills,
                education: updatedUser.education,
                resume: updatedUser.resume,
                company: updatedUser.company,
            },
        });
    } catch (error) {
        console.error(
            "Update Profile Error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while updating profile",
        });
    }
};

// @desc    Upload current user's resume
// @route   PUT /api/auth/profile/resume
const uploadResume = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message:
                    "Please upload a PDF resume.",
            });
        }

        user.resume = `/uploads/resumes/${req.file.filename}`;

        const updatedUser = await user.save();

        res.status(200).json({
            message:
                "Resume uploaded successfully",

            resume: updatedUser.resume,

            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                location: updatedUser.location,
                skills: updatedUser.skills,
                education: updatedUser.education,
                resume: updatedUser.resume,
                company: updatedUser.company,
            },
        });
    } catch (error) {
        console.error(
            "Resume Upload Error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while uploading resume",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
    uploadResume,
};