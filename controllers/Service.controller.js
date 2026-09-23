 const db = require('../models');
const Service = db.service;
const Staff = db.staff;

exports.create = async (req, res) => {
    try {
        const { ServiceName, Price, Duration, Category, StaffID } = req.body;
        if (!ServiceName || !Price || !Duration) {
            return res.status(400).json({ success: false, message: "field required" });
        }
        const details = await Service.create({
            ServiceName,
            Price,
            Duration,
            Category,
            StaffID,
        });
        return res.status(201).json({ success: true, message: "created successfully", data: details });
    }
    catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};

 exports.getAll = async (req, res) => {
    try {
        const {
            ServiceName,
            Price,
            Duration,
            Category,
            IsActive,
            StaffID,
            sortBy,
            order,
            page,
            limit,
        } = req.query;

        const where = {};

        if (ServiceName) where.ServiceName = ServiceName;
        if (Price) where.Price = Price;
        if (Duration) where.Duration = Duration;
        if (Category) where.Category = Category;
        if(StaffID) where.StaffID=StaffID; 
        if (IsActive !== undefined) {
            where.IsActive = IsActive === "true";
        }

        const options = {
            where,

            order: [
                [
                    sortBy || "ServiceID",
                    order === "desc" ? "DESC" : "ASC"
                ]
            ],

            include: [
                {
                    model: db.staff,
                    as: "AssignedStaff",
                    attributes: {
                        exclude: ["Password"]
                    }
                }
            ]
        };

       
        
        if (page && limit) {
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);

            options.limit = limitNum;
            options.offset = (pageNum - 1) * limitNum;
        }

        const details = await Service.findAll(options);

        return res.status(200).json({
            success: true,
            count: details.length,
            data: details
        });
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

exports.getById = async (req, res) => {
    try {
        const details = await Service.findByPk(req.params.id,
            {
                include: [
                    {
                        model: Staff,
                        as: "AssignedStaff",
                        attributes: ["StaffID", "StaffName", "Email"],
                    },
                ],
            }
        );
        if (!details) {
            return res.status(404).json({ success: false, message: "not found" });
        }
        return res.status(200).json({ success: true, message: "details found", data: details });
    }
    catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};

exports.update = async (req, res) => {
    try {
        const details = await Service.findByPk(req.params.id);
        if (!details) {
            return res.status(404).json({ success: false, message: "not found" });
        }
        const updates = {};
        if (req.body.ServiceName) updates.ServiceName = req.body.ServiceName;
        if (req.body.Price) updates.Price = req.body.Price;
        if (req.body.Duration) updates.Duration = req.body.Duration;
        if (req.body.Category) updates.Category = req.body.Category;
        if (req.body.IsActive !== undefined) updates.IsActive = req.body.IsActive;
        // CHANGED: now correctly assigns req.body.StaffID, not req.body.IsActive
        if (req.body.StaffID !== undefined) updates.StaffID = req.body.StaffID;
        await details.update(updates);
        return res.status(200).json({ success: true, message: "updated successfully", data: details });
    }
    catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};


exports.remove = async (req, res) => {
    try {
        const details = await Service.findByPk(req.params.id);
        if (!details) {
            return res.status(404).json({ success: false, message: "not found" });
        }
        await details.destroy();
        return res.status(200).json({ success: true, message: "deleted successfully" });
    }
    catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};