 const db = require("../models");
const LoginReg = db.LoginRegister;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require('../config/mailer');
const { DATE } = require("sequelize");

exports.Register = async (req, res) => {
    try {
        const {
            UserName,
            Email,
            PhoneNo,
            Address,
            Gender,
            Password,
            Role
        } = req.body;

        if (
            !UserName ||
            !Email ||
            !PhoneNo ||
            !Address ||
            !Gender ||
            !Password ||
            !Role
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "UserName, Email, PhoneNo, Address, Gender, Password and Role fields are required"
            });
        }

        const existed = await LoginReg.findOne({
            where: { Email: Email }
        });

        if (existed) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashPassword = await bcrypt.hash(Password, 10);

        const User = await LoginReg.create({
            UserName: UserName,
            Email: Email,
            PhoneNo: PhoneNo,
            Address: Address,
            Gender: Gender,
            Password: hashPassword,
            Role: Role
        });

        return res.status(201).json({
            success: true,
            message: "Registered successfully",
            data: {
                LoginRegID: User.LoginRegID,
                UserName: User.UserName,
                Email: User.Email,
                PhoneNo: User.PhoneNo,
                Address: User.Address,
                Gender: User.Gender,
                Role: User.Role
            }
        });

    } catch (e) {
        console.error("Register Error:", e);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: e.message
        });
    }
};


// ===============================
// LOGIN
// ===============================
exports.login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        if (!Email || !Password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const User = await LoginReg.findOne({
            where: { Email: Email }
        });

        if (!User) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const IsMatch = await bcrypt.compare(Password, User.Password);

        if (!IsMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is not configured"
            });
        }

        const token = jwt.sign(
            {
                LoginRegID: User.LoginRegID,
                Email: User.Email,
                Role: User.Role
            },
            process.env.JWT_SECRET,
            { expiresIn: "48h" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successfully",
            token: token,
            data: {
                LoginRegID: User.LoginRegID,
                UserName: User.UserName,
                Email: User.Email,
                PhoneNo: User.PhoneNo,
                Address: User.Address,
                Gender: User.Gender,
                Role: User.Role
            }
        });

    } catch (e) {
        console.error("Login Error:", e);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: e.message
        });
    }
};


// ===============================
// FORGOT PASSWORD
// ===============================
exports.forgotPassword = async (req, res) => {
    try {
        const { Email } = req.body;

        if (!Email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const User = await LoginReg.findOne({ where: { Email } });

        // Only proceed if the user exists AND is active
        if (!User)
        {
            return res.status(404).json({success:false,message:"Email not exist"});
        }
        if(!User.IsActive)
        {
            return res.status(403).json({success:false,message:"This account is inactive. Please contact support"});
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenexpired = new Date(Date.now() + 5* 60 * 1000);

        User.reset_token = resetToken;
        User.reset_token_expiry = resetTokenexpired;
        await User.save();

        const resetlink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        console.log("Reset link (dev only):", resetlink);

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: User.Email,
            subject: "ShopEase Password Reset",
            html: `
                <p>Hello ${User.UserName},</p>
                <p>You requested a password reset. Click the link below to reset it. This link expires in 15 minutes.</p>
                <p><a href="${resetlink}">${resetlink}</a></p>
                <p>If you did not request this, you can safely ignore this email.</p>`
        });

        return res.status(200).json({
            success: true,
            message: "If that email exists, a reset link has been sent"
        });

    } catch (e) {
        console.error("Forgot Password Error:", e);
        return res.status(500).json({ success: false, message: e.message });
    }
};


// ===============================
// RESET PASSWORD
// ===============================
exports.resetPassword = async (req, res) => {
    try {
        const { Password } = req.body;
        const { token } = req.params;

        if (!Password) {
            return res.status(400).json({
                success: false,
                message: "New password is required"
            });
        }

        if (Password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        const User = await LoginReg.findOne({ where: { reset_token: token } });

        if (!User) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset link"
            });
        }

        if (!User.reset_token_expiry || new Date() > new Date(User.reset_token_expiry)) {
            return res.status(400).json({
                success: false,
                message: "Reset link has expired. Please request a new one"
            });
        }

        const hashPassword = await bcrypt.hash(Password, 10);

        User.Password = hashPassword;
        User.reset_token = null;
        User.reset_token_expiry = null;
        await User.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (e) {
        console.error("Reset Password Error:", e);
        return res.status(500).json({ success: false, message: e.message });
    }
};

