const { parse } = require('dotenv');
const db = require('../models');
const StudentInformation = db.studentinformation;

exports.create = async (req, res) => {
    try {
        const { Name, Branch, Department, College, Skill, IDNo, CGPA } = req.body;

        if (!Name) {
            return res.status(400).json({ success: false, message: "required field" });
        }
        if (!Branch) {
            return res.status(400).json({ success: false, message: "required field" });
        }
        if (!Department) {
            return res.status(400).json({ success: false, message: "required field" });
        }
        if (!College) {
            return res.status(400).json({ success: false, message: "required field" });
        }
        if (!IDNo) {
            return res.status(400).json({ success: false, message: "required field" });
        }
        if (!CGPA) {
            return res.status(400).json({ success: false, message: "required field" });
        }

        const details = await StudentInformation.create({ Name, Branch, Department, College, Skill, IDNo, CGPA });
        return res.status(201).json({ success: true, message: "created successfully", data: details });
    }
    catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};

exports.getAll=async(req,res)=>
{
    try
    {
        const {Name, Branch, Department, College, Skill, IDNo, CGPA,sortBy,order,page,limit}=req.query;
        const where={};
        if(Name) where.Name=Name;
        if(Branch) where.Branch=Branch;
        if(Department) where.Department=Department;
        if(College) where.College=College;
        if(Skill) where.Skill=Skill;
        if(IDNo) where.IDNo=IDNo;
        if(CGPA) where.CGPA=CGPA;

        const options={
            where,
            order:[[sortBy || "StudentInfoID",order==='desc'?"DESC":"ASC"]],
        };
        if(page&&limit)
        {
            const pageNum=parseInt(page);
            const limitNum=parseInt(limit);
            options.limit=limitNum;
            options.offset=(pageNum-1)*limitNum;
        }
        const details=await StudentInformation.findAll(options);
        return res.status(200).json({success:true,count:details.length,data:details});
    }
    catch(e)
    {
        return res.status(500).json({ success: false, message: e.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const details = await StudentInformation.findByPk(req.params.id);
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
        const details = await StudentInformation.findByPk(req.params.id);
        if (!details) {
            return res.status(404).json({ success: false, message: "not found" });
        }
        const updates = {};
        if (req.body.Name) updates.Name = req.body.Name;
        if (req.body.Branch) updates.Branch = req.body.Branch;
        if (req.body.Department) updates.Department = req.body.Department;
        if (req.body.College) updates.College = req.body.College;
        if (req.body.Skill) updates.Skill = req.body.Skill;
        if (req.body.IDNo) updates.IDNo = req.body.IDNo;
        if (req.body.CGPA) updates.CGPA = req.body.CGPA;

        await details.update(updates);
        return res.status(200).json({ success: true, message: "updated successfully", data: details });
    }
    catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const details = await StudentInformation.findByPk(req.params.id);
        if (!details) {
            return res.status(404).json({ success: false, message: "not found" });
        }
        await details.destroy();
        return res.status(200).json({ success: true, message: "deleted successfully" });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};