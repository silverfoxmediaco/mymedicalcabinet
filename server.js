require("dotenv").config();

const session = require("express-session");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
//const helmet = require("helmet");
const nodemailer = require("nodemailer");
const userRoutes = require("./auth");

const app = express(); 

app.use("/api", userRoutes); 
/*app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],

    },
  })
);*/


// Models & Routes
const User = require("./User");
const medicationRoutes = require("./routes/medications");
const physicianRoutes = require("./routes/physicians");
const insuranceRoutes = require("./routes/insurance");
const healthHistoryRoutes = require("./routes/healthHistory");
const profileRoutes = require("./routes/profile");
app.use("/api/profile", profileRoutes);


// Initialize App
app.use(cors());
const PORT = 3000;

// Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || "my-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set true if using https
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2 
    }
  }));  
app.use(express.json());
// Protect specific static pages

app.use((req, res, next) => {
  if (req.path === "/mydashboard.html" && !req.session.userId) {
    return res.redirect("/login.html");
  }
 next();
});

app.use(express.static("public")); // Serve HTML, CSS, JS, etc.
// API Routes
app.use("/api/medications", medicationRoutes);
app.use("/api/physicians", physicianRoutes);
app.use("/api/insurance", insuranceRoutes);
app.use("/api/health-history", healthHistoryRoutes);
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Email Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILGUN_SMTP_USER,
    pass: process.env.MAILGUN_SMTP_PASS
  }
});

// Signup Route
app.post("/api/signup", async (req, res) => {
  const { name, username, email, password } = req.body;
  const verificationToken = Math.random().toString(36).slice(2);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      verificationToken
    });
    await user.save();

    const verificationLink = `http://localhost:${PORT}/verify?token=${verificationToken}`;
    await transporter.sendMail({
      to: email,
      subject: "Verify Your My Medical Cabinet Account",
      html: `Click <a href="${verificationLink}">here</a> to verify your email.`
    });

    res.json({ message: "Signup successful! Check your email to verify." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed. Email may already be registered." });
  }
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
  
      if (!user) return res.status(401).json({ message: "User not found." });
      if (!user.isVerified) return res.status(403).json({ message: "Email not verified." });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Incorrect password." });
  
      // Store session info
      req.session.userId = user._id;
      req.session.username = user.username;
  
      res.json({ message: "Login successful!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Login failed." });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ message: "Logout failed." });
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out." });
    });
  });
// Email Verification Route
app.get("/verify", async (req, res) => {
  const { token } = req.query;

  const user = await User.findOneAndUpdate(
    { verificationToken: token },
    { isVerified: true, verificationToken: null },
    { new: true }
  );

  if (user) {
    res.redirect("/mydashboard.html");
  } else {
    res.send("<h2>Invalid or expired verification link.</h2>");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
