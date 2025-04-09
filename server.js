require("dotenv").config();

const session = require("express-session");
const cors = require("cors");
const express = require("express");
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
app.use(express.json());
app.use(cors());

const PORT = 3000;


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

app.use("/api", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/physicians", physicianRoutes);
app.use("/api/insurance", insuranceRoutes);
app.use("/api/health-history", healthHistoryRoutes);

app.use((req, res, next) => {
  if (req.path === "/mydashboard.html" && !req.session.userId) {
    return res.redirect("/login.html");
  }
  next();
});

// Email verification redirect
app.get("/verify", (req, res) => {
  res.redirect(`/api/verify?token=${req.query.token}`);
});

// Serve frontend files
app.use(express.static("public"));

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
