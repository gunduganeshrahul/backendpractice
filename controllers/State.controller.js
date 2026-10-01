 const db = require("../models");

const State = db.state;
const Company = db.company;

// CREATE STATE
exports.create = async (req, res) => {
    try {
        const { StateName, StateCode, CompanyID } = req.body;

        if (!StateName || !StateCode || !CompanyID) {
            return res.status(400).json({
                success: false,
                message: "StateName, StateCode, CompanyID field required",
            });
        }

        // Check Company exists
        const company = await Company.findByPk(CompanyID);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        const details = await State.create({
            StateName,
            StateCode,
            CompanyID,
        });

        return res.status(201).json({
            success: true,
            message: "State created successfully",
            data: details,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};


// GET ALL STATES
exports.getAll = async (req, res) => {
    try {
        const details = await State.findAll({
            include: [
                {
                    model: Company,
                    attributes: [
                        "CompanyName",
                        "CompanyCode",
                        "Email",
                    ],
                },
            ],
        });

        if (details.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No states found",
            });
        }

        return res.status(200).json({
            success: true,
            count: details.length,
            data: details,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};


// GET STATE BY ID
exports.getByPk = async (req, res) => {
    try {
        const details = await State.findByPk(req.params.id, {
            include: [
                {
                    model: Company,
                    attributes: [
                        "CompanyCode",
                        "CompanyName",
                        "Email",
                    ],
                },
            ],
        });

        if (!details) {
            return res.status(404).json({
                success: false,
                message: "State details not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "State details found",
            data: details,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};


// GET STATES BY COMPANY ID
exports.getByCompany = async (req, res) => {
    try {
        const { CompanyID } = req.params;

        const details = await State.findAll({
            where: {
                CompanyID: CompanyID,
            },
            attributes: [
                "StateID",
                "StateName",
                "StateCode",
            ],
        });

        if (details.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No states found for this company",
            });
        }

        return res.status(200).json({
            success: true,
            count: details.length,
            data: details,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};