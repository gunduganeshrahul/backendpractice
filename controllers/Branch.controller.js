 const db = require('../models');

const Branch = db.branch;
const City = db.city;
const State = db.state;
const Company = db.company;


// ================= CREATE BRANCH =================

exports.create = async (req, res) => {
    try {

        const { BranchName, BranchCode, CityID } = req.body;

        if (!BranchName || !BranchCode || !CityID) {
            return res.status(400).json({
                success: false,
                message: "BranchName, BranchCode, CityID are required"
            });
        }

        // Check City exists
        const city = await City.findByPk(CityID);

        if (!city) {
            return res.status(404).json({
                success: false,
                message: "City not found"
            });
        }

        const details = await Branch.create({
            BranchName,
            BranchCode,
            CityID
        });

        return res.status(201).json({
            success: true,
            message: "Branch created successfully",
            data: details
        });

    } catch (e) {

        return res.status(500).json({
            success: false,
            message: e.message
        });

    }
};


// ================= GET ALL BRANCH =================

exports.getAll = async (req, res) => {
    try {

        const details = await Branch.findAll({
            include: [
                {
                    model: City,

                    attributes: [
                        "CityName",
                        "CityCode"
                    ],

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
                }
            ]
        });

        if (details.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No branches found"
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


// ================= GET BRANCH BY ID =================

exports.getByPk = async (req, res) => {
    try {

        const details = await Branch.findByPk(req.params.id, {
            include: [
                {
                    model: City,

                    attributes: [
                        "CityName",
                        "CityCode"
                    ],

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
                }
            ]
        });

        if (!details) {
            return res.status(404).json({
                success: false,
                message: "Branch details not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Branch details found",
            data: details
        });

    } catch (e) {

        return res.status(500).json({
            success: false,
            message: e.message
        });

    }
};


// ================= GET BRANCHES BY CITY ID =================

exports.getByCity = async (req, res) => {
    try {

        const { CityID } = req.params;

        const details = await Branch.findAll({
            where: {
                CityID: CityID
            },

            attributes: [
                "BranchID",
                "BranchName",
                "BranchCode"
            ]
        });

        if (details.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No branches found for this city"
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