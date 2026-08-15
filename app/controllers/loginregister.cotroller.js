 const db = require('../models');
const User = db.loginreg;   // ← fixed to match the model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { UserName, Email, Password } = req.body;
    if (!UserName || !Email || !Password) {
      return res.status(400).json({ success: false, message: "field required" });
    }
    const existing = await User.findOne({ where: { Email } });
    if (existing) {
      return res.status(409).json({ success: false, message: "already existed" });
    }
    const hashpassword = await bcrypt.hash(Password, 10);
    const NewUser = await User.create({
      UserName,
      Email,
      Password: hashpassword,
    });
    return res.status(201).json({
      success: true,
      message: "register successfully",
      data: {
        UserID: NewUser.UserID,
        UserName: NewUser.UserName,
        Email: NewUser.Email,
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
      return res.status(400).json({ success: false, message: "field required" });
    }
    const inform = await User.findOne({ where: { Email } });
    if (!inform) {
      return res.status(401).json({ success: false, message: "invalid" });
    }
    const isMatch = await bcrypt.compare(Password, inform.Password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "invalid" });
    }
    const token = jwt.sign(
      { UserID: inform.UserID, Email: inform.Email },
      process.env.JWT_SECRET,
      { expiresIn: "48h" }
    );
    return res.status(200).json({
      success: true,
      message: "login successfully",
      token,
      data: {
        UserID: inform.UserID,
        UserName: inform.UserName,
        Email: inform.Email,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};