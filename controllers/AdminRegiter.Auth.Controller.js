 const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const Admin = db.adminreg;

exports.register = async (req, res) => {
  try {
    const { AdminName, Email, PhoneNum, Password } = req.body;

    if (!AdminName || !Email || !PhoneNum || !Password) {
      return res.status(400).json({ success: false, message: "every field required" });
    }

    const existingEmail = await Admin.findOne({ where: { Email } });
    if (existingEmail) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const existingPhonum = await Admin.findOne({ where: { PhoneNum } });
    if (existingPhonum) {
      return res.status(409).json({ success: false, message: "Phone number already registered" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newAdmin = await Admin.create({
      AdminName,
      Email,
      PhoneNum,
      Password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "register successfully",
      data: {
        AdminID: newAdmin.AdminID,
        AdminName: newAdmin.AdminName,
        Email: newAdmin.Email,
        PhoneNum: newAdmin.PhoneNum,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({ success: false, message: "all field required" });
    }

    const User = await Admin.findOne({ where: { Email } });
    if (!User) {
      return res.status(401).json({ success: false, message: "invalid credentials" });
    }

    const isMatch = await bcrypt.compare(Password, User.Password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "invalid credentials" });
    }

    const token = jwt.sign(
      {
        AdminID: User.AdminID,
        Email: User.Email,
        PhoneNum: User.PhoneNum,
      },
      process.env.JWT_SECRET,
      { expiresIn: "48h" }
    );

    return res.status(200).json({
      success: true,
      message: "login successfully",
      token,
      data: {
        AdminID: User.AdminID,
        AdminName: User.AdminName,
        PhoneNum: User.PhoneNum,
        Email: User.Email,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

exports.profile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};