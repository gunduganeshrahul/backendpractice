 const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");

const Doctor = db.doctor;
const Speciality = db.speciality;


// =====================================================
// REGISTER DOCTOR
// =====================================================

exports.register = async (req, res) => {
    try {

        const {
            DoctorName,
            Email,
            Password,
            SpecialityID       // ⭐ CHANGED
        } = req.body;


        // ⭐ CHANGED
        // SpecialityID is now required
        if (!DoctorName || !Email || !Password || !SpecialityID) {
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


        // Hash password
        const HashPassword = await bcrypt.hash(
            Password,
            10
        );


        // ⭐ CHANGED
        // Save SpecialityID instead of Specialization
        const newUser = await Doctor.create({
            DoctorName,
            Email,
            Password: HashPassword,
            SpecialityID
        });


        // ⭐ NEW
        // Fetch Doctor together with Speciality
        const doctor = await Doctor.findByPk(
            newUser.DoctorID,
            {
                attributes: {
                    exclude: ["Password"]
                },

                include: [
                    {
                        model: Speciality,
                        attributes: [
                            "SpecialityID",
                            "SpecialityName"
                        ]
                    }
                ]
            }
        );


        // ⭐ CHANGED
        // Now response shows Speciality
        return res.status(201).json({
            success: true,
            message: "Created successfully",
            data: doctor
        });

    } catch (e) {

        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
};



// =====================================================
// LOGIN
// =====================================================

exports.Login = async (req, res) => {

    try {

        const {
            Email,
            Password
        } = req.body;


        if (!Email || !Password) {

            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }


        // ⭐ CHANGED
        // Include Speciality while finding Doctor
        const verify = await Doctor.findOne({

            where: {
                Email
            },

            include: [
                {
                    model: Speciality,
                    attributes: [
                        "SpecialityID",
                        "SpecialityName"
                    ]
                }
            ]
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


        // ⭐ CHANGED
        // Show Speciality
        return res.status(200).json({

            success: true,

            message: "Login successfully",

            token,

            data: {

                DoctorID: verify.DoctorID,

                DoctorName: verify.DoctorName,

                Email: verify.Email,

                SpecialityID: verify.SpecialityID,

                Speciality: verify.Speciality
            }
        });

    } catch (e) {

        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
};



// =====================================================
// GET MY PROFILE
// =====================================================

exports.getMyProfile = async (req, res) => {

    try {

        // ⭐ CHANGED
        // Include Speciality
        const details = await Doctor.findByPk(

            req.user.DoctorID,

            {
                attributes: {
                    exclude: ["Password"]
                },

                include: [
                    {
                        model: Speciality,
                        attributes: [
                            "SpecialityID",
                            "SpecialityName"
                        ]
                    }
                ]
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



// =====================================================
// UPDATE MY PROFILE
// =====================================================

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

            update.DoctorName =
                req.body.DoctorName;
        }


        // ⭐ CHANGED
        // OLD:
        // req.body.Specialization
        //
        // NEW:
        // req.body.SpecialityID

        if (req.body.SpecialityID !== undefined) {

            update.SpecialityID =
                req.body.SpecialityID;
        }


        if (req.body.Email !== undefined) {

            update.Email =
                req.body.Email;
        }


        if (req.body.Password !== undefined) {

            update.Password =
                await bcrypt.hash(
                    req.body.Password,
                    10
                );
        }


        await details.update(update);


        // ⭐ NEW
        // Fetch updated Doctor with Speciality

        const updatedDoctor =
            await Doctor.findByPk(

                details.DoctorID,

                {
                    attributes: {
                        exclude: ["Password"]
                    },

                    include: [
                        {
                            model: Speciality,
                            attributes: [
                                "SpecialityID",
                                "SpecialityName"
                            ]
                        }
                    ]
                }
            );


        return res.status(200).json({

            success: true,

            message: "Profile updated successfully",

            // ⭐ CHANGED
            data: updatedDoctor
        });

    } catch (e) {

        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
};