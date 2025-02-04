
// const { body, validationResult } = require("express-validator");
// const sequelize = require("../config/database");
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
// const { Op } = require("sequelize");
// const speakeasy = require("speakeasy");
// const User = require("../models/User");

// // ✅ Configure Nodemailer
// const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// // ✅ Input Validation Middleware
// const validateSignup = [
//     body("firstname").trim().escape().isLength({ min: 2 }).withMessage("First name must be at least 2 characters."),
//     body("lastname").trim().escape().isLength({ min: 2 }).withMessage("Last name must be at least 2 characters."),
//     body("email").trim().isEmail().normalizeEmail().withMessage("Invalid email format."),
//     body("phone_number").trim().matches(/^\+[1-9]{1}[0-9]{3,14}$/).withMessage("Invalid phone number format."),
//     body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long."),
// ];

// // ✅ Secure User Signup
// exports.signup = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         const { firstname, lastname, email, phone_number, password } = req.body;

//         // Prevent duplicate accounts
//         const existingUser = await sequelize.query(
//             `SELECT email FROM "Users" WHERE email = :email`,
//             { replacements: { email }, type: sequelize.QueryTypes.SELECT }
//         );
//         if (existingUser.length > 0) {
//             return res.status(400).json({ error: "Email already exists" });
//         }

//         // Hash password inside PostgreSQL using crypt()
//         await sequelize.query(
//             `INSERT INTO "Users" (firstname, lastname, email, phone_number, password) 
//              VALUES (:firstname, :lastname, :email, :phone_number, crypt(:password, gen_salt('bf')))`,
//             {
//                 replacements: { firstname, lastname, email, phone_number, password },
//             }
//         );

//         res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Error signing up" });
//     }
// };

// // ✅ Secure User Signin
// exports.signin = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Query the user and verify password using pgcrypto
//         const user = await sequelize.query(
//             `SELECT id, firstname, lastname, email, phone_number 
//              FROM "Users" 
//              WHERE email = :email AND password = crypt(:password, password)`,
//             {
//                 replacements: { email, password },
//                 type: sequelize.QueryTypes.SELECT,
//             }
//         );

//         if (user.length === 0) {
//             return res.status(401).json({ error: "Invalid credentials" });
//         }

//         // Generate JWT Token (Secure with HS256 algorithm)
//         const token = jwt.sign(
//             { userId: user[0].id, email: user[0].email },
//             process.env.JWT_SECRET,
//             { expiresIn: "1h", algorithm: "HS256" }
//         );

//         res.json({ message: "Login successful", token });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Error signing in" });
//     }
// };

// // ✅ Generate and Send OTP via Email for MFA
// exports.sendOtp = async (req, res) => {
//     try {
//         const { email } = req.body;

//         // Check if user exists
//         const user = await User.findOne({ where: { email } });
//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         // ✅ Check if existing OTP is still valid
//         if (user.otp_code && user.otp_expiry > new Date()) {
//             return res.json({ message: "OTP already sent. Please check your email." });
//         }

//         // Generate a 6-digit OTP
//         const otp = speakeasy.totp({
//             secret: process.env.OTP_SECRET,
//             encoding: "base32",
//             step: 30 // OTP is valid for 5 minutes
//         });

//         // Store OTP and expiration time in the database
//         await user.update({ otp_code: otp, otp_expiry: new Date(Date.now() + 5 * 60 * 1000) });

//         // Send OTP email
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: "Your OTP for MFA",
//             text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`
//         };

//         await transporter.sendMail(mailOptions);
//         res.json({ message: "OTP sent to email!" });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Error sending OTP" });
//     }
// };

// // ✅ Verify OTP
// exports.verifyOtp = async (req, res) => {
//     try {
//         const { email, otp } = req.body;

//         // Find user with OTP
//         const user = await User.findOne({
//             where: {
//                 email,
//                 otp_code: otp,
//                 otp_expiry: { [Op.gt]: new Date() } // Ensure OTP is not expired
//             }
//         });

//         if (!user) {
//             return res.status(400).json({ error: "Invalid or expired OTP" });
//         }

//         // Clear OTP after successful verification
//         await user.update({ otp_code: null, otp_expiry: null });

//         res.json({ message: "OTP verified successfully!" });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Error verifying OTP" });
//     }
// };

// // ✅ Forgot Password
// exports.forgotPassword = async (req, res) => {
//     try {
//         const { email } = req.body;

//         // Check if user exists
//         const user = await User.findOne({ where: { email } });
//         if (!user) {
//             return res.status(404).json({ error: "User with this email does not exist" });
//         }

//         // Generate a reset token (valid for 15 minutes)
//         const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });

//         // Send reset email
//         const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: "Password Reset Request",
//             text: `Click the link below to reset your password: \n\n ${resetLink} \n\n This link expires in 15 minutes.`
//         };

//         await transporter.sendMail(mailOptions);
//         res.json({ message: "Password reset link sent successfully. Check your email!" });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Error processing password reset request" });
//     }
// };

// // ✅ Reset Password
// exports.resetPassword = async (req, res) => {
//     try {
//         const { token, newPassword } = req.body;

//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         if (!decoded.userId) {
//             return res.status(401).json({ error: "Invalid or expired token" });
//         }

//         // Update password
//         await User.update(
//             { password: sequelize.fn("crypt", newPassword, sequelize.fn("gen_salt", "bf")) },
//             { where: { id: decoded.userId } }
//         );

//         res.json({ message: "Password reset successful! You can now log in." });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Error resetting password" });
//     }
// };


const { body, validationResult } = require("express-validator");
const sequelize = require("../config/database");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const speakeasy = require("speakeasy");
const User = require("../models/User");

// ✅ Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ Secure User Signup with OTP Automation
const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { firstname, lastname, email, phone_number, password } = req.body;

        // Prevent duplicate accounts
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Create new user
        await User.create({
            firstname,
            lastname,
            email,
            phone_number,
            password
        });

        // ✅ Send OTP after signup
        await sendOtp({ body: { email } }, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error signing up" });
    }
};

// ✅ Generate and Send OTP via Email for MFA
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // ✅ Check if existing OTP is still valid
        if (user.otp_code && user.otp_expiry > new Date()) {
            return res.json({ message: "OTP already sent. Please check your email." });
        }

        // Generate a 6-digit OTP
        const otp = speakeasy.totp({
            secret: process.env.OTP_SECRET,
            encoding: "base32",
            step: 30 // OTP is valid for 5 minutes
        });

        // Store OTP and expiration time in the database
        await user.update({ otp_code: otp, otp_expiry: new Date(Date.now() + 5 * 60 * 1000) });

        // Send OTP email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for MFA",
            text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent to email!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error sending OTP" });
    }
};

// ✅ Verify OTP
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find user with OTP
        const user = await User.findOne({
            where: {
                email,
                otp_code: otp,
                otp_expiry: { [Op.gt]: new Date() } // Ensure OTP is not expired
            }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // Clear OTP after successful verification
        await user.update({ otp_code: null, otp_expiry: null });

        res.json({ message: "OTP verified successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error verifying OTP" });
    }
};

// ✅ Secure User Signin
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Query the user and verify password using pgcrypto
        const user = await sequelize.query(
            `SELECT id, firstname, lastname, email, phone_number 
             FROM "Users" 
             WHERE email = :email AND password = crypt(:password, password)`,
            {
                replacements: { email, password },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (user.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT Token (Secure with HS256 algorithm)
        const token = jwt.sign(
            { userId: user[0].id, email: user[0].email },
            process.env.JWT_SECRET,
            { expiresIn: "1h", algorithm: "HS256" }
        );

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error signing in" });
    }
};

// ✅ Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User with this email does not exist" });
        }

        // Generate a reset token (valid for 15 minutes)
        const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });

        // Send reset email
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            text: `Click the link below to reset your password: \n\n ${resetLink} \n\n This link expires in 15 minutes.`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Password reset link sent successfully. Check your email!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error processing password reset request" });
    }
};

// ✅ Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.userId) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // Update password
        await User.update(
            { password: sequelize.fn("crypt", newPassword, sequelize.fn("gen_salt", "bf")) },
            { where: { id: decoded.userId } }
        );

        res.json({ message: "Password reset successful! You can now log in." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error resetting password" });
    }
};

// ✅ Correctly Export All Functions
module.exports = {
    signup,
    signin,
    sendOtp,
    verifyOtp,
    forgotPassword,
    resetPassword
};
