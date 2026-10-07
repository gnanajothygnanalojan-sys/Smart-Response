const User = require("../models/User");
const Responder = require("../models/Responder");
const Volunteer = require("../models/Volunteer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =============================
// REGISTER USER
// =============================
const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            role,
            department,
            skills
        } = req.body;

        if (!name || !email || !password || !phone || !role) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const allowedRoles = [
            "citizen",
            "responder",
            "volunteer",
            "coordinator"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role selected"
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "An account with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create main user account
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role
        });

        // =============================
        // CREATE RESPONDER PROFILE
        // =============================
        if (role === "responder") {
            if (!department) {
                await User.findByIdAndDelete(user._id);

                return res.status(400).json({
                    message: "Department is required for responders"
                });
            }

            await Responder.create({
                user: user._id,
                name,
                email,
                phone,
                department,
                availability: "Available",
                status: "Active"
            });
        }

        // =============================
        // CREATE VOLUNTEER PROFILE
        // =============================
        if (role === "volunteer") {
            if (!skills) {
                await User.findByIdAndDelete(user._id);

                return res.status(400).json({
                    message: "Skills are required for volunteers"
                });
            }

            await Volunteer.create({
                name,
                email,
                phone,
                skills,
                availability: "Available",
                status: "Active"
            });
        }

        res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        res.status(500).json({
            message: "Server error during registration"
        });
    }
};


// =============================
// LOGIN USER
// =============================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (user.status === "inactive") {
            return res.status(403).json({
                message: "This account is inactive"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            message: "Server error during login"
        });
    }
};

// =============================
// GET LOGGED-IN USER PROFILE
// =============================
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            "-password"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        console.error("Get profile error:", error.message);

        res.status(500).json({
            message: "Server error while loading profile"
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getProfile
};