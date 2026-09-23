 const db = require("../models");

const Speciality = db.speciality;

exports.create = async (req, res) => {
    try {

        const { SpecialityName } = req.body;

        if (!SpecialityName) {
            return res.status(400).json({
                success: false,
                message: "SpecialityName is required",
            });
        }

        const details = await Speciality.create({
            SpecialityName,
        });

        return res.status(201).json({
            success: true,
            message: "Speciality created successfully",
            data: details,
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};