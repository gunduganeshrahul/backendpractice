const bcrypt = require("bcrypt");
const db = require("../models");

const Register = db.registerFE;

exports.register = async (req, res) => {
  try {

    // Get data from frontend
    const {
      UserName,
      Email,
      Password
    } = req.body;

    // Check required fields
    if (!UserName || !Email || !Password) {
      return res.status(400).json({
        success: false,
        message: "Every field is required"
      });
    }

    // Check email already exists
    const existingUser = await Register.findOne({
      where: {
        Email: Email
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create user
    const newUser = await Register.create({
      UserName: UserName,
      Email: Email,
      Password: hashedPassword
    });

    // Send response
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        UserID: newUser.UserID,
        UserName: newUser.UserName,
        Email: newUser.Email
      }
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};