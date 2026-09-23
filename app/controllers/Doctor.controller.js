 const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");

const Doctor = db.doctor;



exports.register = async (req, res) => {
    try {
        const {
            DoctorName,
            Email,
            Password,
            Specialization
        } = req.body;

        if (!DoctorName || !Email || !Password) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });
        }

        const existed = await Doctor.findOne({
            where: { Email }
        });

        if (existed) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const HashPassword = await bcrypt.hash(Password, 10);

        const newUser = await Doctor.create({
            DoctorName,
            Email,
            Password: HashPassword,
            Specialization
        });

        return res.status(201).json({
            success: true,
            message: "Created successfully",
            data: {
                DoctorID: newUser.DoctorID,
                DoctorName: newUser.DoctorName,
                Email: newUser.Email,
                Specialization: newUser.Specialization
            }
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
};


 

exports.Login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        if (!Email || !Password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const verify = await Doctor.findOne({
            where: { Email }
        });

        if (!verify) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            Password,
            verify.Password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                DoctorID: verify.DoctorID,
                Email: verify.Email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "72h"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successfully",
            token,
            data: {
                DoctorID: verify.DoctorID,
                DoctorName: verify.DoctorName,
                Email: verify.Email,
                Specialization: verify.Specialization
            }
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
};


 

exports.getMyProfile = async (req, res) => {
    try {

        const details = await Doctor.findByPk(
            req.user.DoctorID,
            {
                attributes: {
                    exclude: ["Password"]
                }
            }
        );

        if (!details) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: details
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
};


exports.updateMyProfile = async (req, res) => {
    try {

        const details = await Doctor.findByPk(
            req.user.DoctorID
        );

        if (!details) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        const update = {};

        if (req.body.DoctorName !== undefined) {
            update.DoctorName = req.body.DoctorName;
        }

        if (req.body.Specialization !== undefined) {
            update.Specialization = req.body.Specialization;
        }

        if (req.body.Email !== undefined) {
            update.Email = req.body.Email;
        }

        if (req.body.Password !== undefined) {
            update.Password = await bcrypt.hash(
                req.body.Password,
                10
            );
        }

        await details.update(update);

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                DoctorID: details.DoctorID,
                DoctorName: details.DoctorName,
                Email: details.Email,
                Specialization: details.Specialization
            }
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
};