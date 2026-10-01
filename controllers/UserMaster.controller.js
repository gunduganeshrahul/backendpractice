 const db = require("../models");

const UserMaster = db.usermaster;
const Branch = db.branch;
const City = db.city;
const State = db.state;
const Company = db.company;

const bcrypt = require("bcrypt");


// ================= CREATE USER =================

exports.create = async (req, res) => {
    try {

        const {
            UserMasterID,
            UserMasterName,
            Password,
            Email,
            BranchID
        } = req.body;


        // Required fields
        if (
            !UserMasterID ||
            !UserMasterName ||
            !Password ||
            !BranchID
        ) {
            return res.status(400).json({
                success: false,
                message: "UserMasterID, UserMasterName, Password and BranchID are required"
            });
        }


        // Check Branch exists
        const branch = await Branch.findByPk(BranchID);

        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found"
            });
        }


        // Check UserMasterID already exists
        const existingUser = await UserMaster.findByPk(UserMasterID);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "UserMasterID already exists"
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(Password, 10);


        // Create user
        const details = await UserMaster.create({
            UserMasterID,
            UserMasterName,
            Password: hashedPassword,
            Email,
            BranchID
        });


        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: details
        });

    } catch (e) {

        return res.status(500).json({
            success: false,
            message: e.message
        });

    }
};


// ================= GET ALL USERS =================

exports.getAll = async (req, res) => {
    try {

        const details = await UserMaster.findAll({
            attributes: {
                exclude: ["Password"]
            },

            include: [
                {
                    model: Branch,

                    attributes: [
                        "BranchName",
                        "BranchCode"
                    ],

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
                }
            ]
        });


        if (details.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found"
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


// ================= GET USER BY ID =================

exports.getByID = async (req, res) => {
    try {

        const details = await UserMaster.findByPk(
            req.params.id,
            {
                attributes: {
                    exclude: ["Password"]
                },

                include: [
                    {
                        model: Branch,

                        attributes: [
                            "BranchName",
                            "BranchCode"
                        ],

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
                    }
                ]
            }
        );


        if (!details) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        return res.status(200).json({
            success: true,
            message: "User details found",
            data: details
        });

    } catch (e) {

        return res.status(500).json({
            success: false,
            message: e.message
        });

    }
};