require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const cors = require("cors");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const helmet = require("helmet");
const nodemailer = require("nodemailer");

const userRoutes = require("./routes/auth");
const medicationRoutes = require("./routes/medications");
const physicianRoutes = require("./routes/physicians");
const insuranceRoutes = require("./routes/insurance");
const healthHistoryRoutes = require("./routes/healthHistory");
const profileRoutes = require("./routes/profile");

const app = express(); 
const PORT = 3000;

//core middlewares
app.use(express.json());
app.use(cors());
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

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

  // Email transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILGUN_SMTP_USER,
    pass: process.env.MAILGUN_SMTP_PASS
  }
});

//api routes
app.use("/api", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/physicians", physicianRoutes);
app.use("/api/insurance", insuranceRoutes);
app.use("/api/health-history", healthHistoryRoutes);

//session check for dashboard access
app.use((req, res, next) => {
  if (req.path === "/mydashboard.html" && !req.session.userId) {
    return res.redirect("/login.html");
  }
  next();
});

// Serve frontend files
//app.use(express.static("public"));
app.use(express.static(path.join(__dirname)));


// Email verification redirect
app.get("/verify", (req, res) => {
  res.redirect(`/api/verify?token=${req.query.token}`);
});


// Fallback for SPA-style routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
