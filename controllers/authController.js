const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const { sendEmail } = require("../utils/sendEmail");

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000);

    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      otp,
      isVerified: false,
    });

    await user.save();

    // ✅ Send OTP email
    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      text: `Your OTP is: ${otp}`,
      html: `<p>Hi ${name},</p><p>Your OTP is: <strong>${otp}</strong></p><p>Please do not share this code with anyone.</p>`,
    });

    res.status(201).json({ message: "OTP sent to email", email });
  } catch (err) {
    res.status(500).json({ message: "Registration error", error: err.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    await user.save();

    // ✅ Send OTP email
    await sendEmail({
      to: email,
      subject: "Login OTP",
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP for login is: <strong>${otp}</strong></p>`,
    });

    res.status(200).json({ message: "OTP sent to email", email });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log(email,otp)

  try {
    const user = await UserModel.findOne({ email });

    if (!user || user.otp !== parseInt(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "OTP verified",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "OTP verification error",
      error: err.message,
    });
  }
};



module.exports = { registerUser, verifyOtp, loginUser };
