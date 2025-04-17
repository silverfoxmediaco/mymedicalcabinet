const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Mailgun email setup
const mailgunAuth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILGUN_SMTP_USER,
    pass: process.env.MAILGUN_SMTP_PASS,
  },
});


// SIGN UP
router.post("/signup", async (req, res) => {
  const { name, username, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role,
      verificationToken: token,
      isVerified: false,
    });

    await user.save();

    const verifyLink = `https://mymedicalcabinet.onrender.com/verify?token=${token}`;

    await transporter.sendMail({
      from: `"My Medical Cabinet" <no-reply@mymedicalcabinet.com>`,
      to: email,
      subject: "Verify your email",
      html: `<p>Click the link below to verify your email:</p><a href="${verifyLink}">${verifyLink}</a>`,
    });

    res.status(201).json({ message: "Verification email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isVerified) return res.status(403).json({ message: "Please verify your email before logging in." });

    req.session.userId = user._id;
    req.session.role = user.role;
    res.json({ message: "Login successful", role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // clear session cookie
    res.json({ message: "Logged out successfully" });
  });
});


// EMAIL VERIFICATION
router.get("/verify", async (req, res) => {
  const token = req.query.token;
  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).send("Invalid or expired verification link.");

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.redirect("/mydashboard.html");
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).send("Internal Server Error during verification.");
  }
});


module.exports = router;
