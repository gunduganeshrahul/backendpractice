 const db = require('../models');

const City = db.city;
const State = db.state;
const Company = db.company;


// ================= CREATE CITY =================

exports.create = async (req, res) => {
    try {

        const { CityName, CityCode, StateID } = req.body;

        if (!CityName || !CityCode || !StateID) {
            return res.status(400).json({
                success: false,
                message: "CityName, CityCode, StateID required"
            });
        }

        // Check State exists
        const state = await State.findByPk(StateID);

        if (!state) {
            return res.status(404).json({
                success: false,
                message: "State not found"
            });
        }

        const details = await City.create({
            CityName,
            CityCode,
            StateID
        });

        return res.status(201).json({
            success: true,
            message: "City created successfully",
            data: details
        });

    } catch (e) {

        return res.status(500).json({
            success: false,
            message: e.message
        });

    }
};


// ================= GET ALL CITY =================

exports.getAll = async (req, res) => {
    try {

        const details = await City.findAll({
            include: [
                {
                    model: State,

                    attributes: [
                        "StateName",
                        "StateCode"
                    ],

                    include: [
                        {
                            model: Company,

                            attributes: [
                                "CompanyName",
                                "CompanyCode",
                                "Email"
                            ]
                        }
                    ]
                }
            ]
        });

        if (details.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Data not found"
            });
        }

        return res.status(200).json({
            success: true,
            count: details.length,
            data: details
        });

    } catch (e) {

        return res.status(500).json({
            success: false,
            message: e.message
        });

    }
};


// ================= GET CITY BY ID =================

exports.getByPk = async (req, res) => {
    try {

        const details = await City.findByPk(req.params.id, {
            include: [
                {
                    model: State,

                    attributes: [
                        "StateName",
                        "StateCode"
                    ],

                    include: [
                        {
                            model: Company,

                            attributes: [
                                "CompanyName",
                                "CompanyCode",
                                "Email"
                            ]
                        }
                    ]
                }
            ]
        });

        if (!details) {
            return res.status(404).json({
                success: false,
                message: "City details not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "City details found",
            data: details
        });

    } catch (e) {

        return res.status(500).json({
            success: false,
            message: e.message
        });

    }
};


// ================= GET CITIES BY STATE ID =================

exports.getByState = async (req, res) => {
    try {

        const { StateID } = req.params;

        const details = await City.findAll({
            where: {
                StateID: StateID
            },

            attributes: [
                "CityID",
                "CityName",
                "CityCode"
            ]
        });

        if (details.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No cities found for this state"
            });
        }

        return res.status(200).json({
            success: true,
            count: details.length,
            data: details
        });

    } catch (e) {

        return res.status(500).json({
            success: false,
            message: e.message
        });

    }
};