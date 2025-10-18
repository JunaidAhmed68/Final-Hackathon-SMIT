import express from "express";
import Joi from "joi";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import nodemailer from "nodemailer";

const route = express.Router();

const registerSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "dev"] } })
    .required(),
  password: Joi.string().min(6).required(),
  age: Joi.number().strict().integer().min(1).required(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "dev"] } })
    .required(),
  password: Joi.string().min(6).required(),
});


route.post("/signup", async (req, res) => {
  try {
    const { username, email, age, password } = req.body;

    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }

    let findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(400).json({
        error: true,
        message: "User already exists with this email!",
      });
    }

    // bcrypt password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // create user
    let newUser = new User({
      username,
      email,
      age,
      password: hashPassword,
      isEmailVerified:true,
    });

    newUser = await newUser.save();
    res.status(200).json({
      error: false,
      message: "User registered successfully!",
      data: newUser,
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error!",
    });
  }
});

//  LOGIN
route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: true, message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: true, message: "Invalid credentials!" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ error: true, message: "Email not verified!" });
    }

    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        age: user.age,
        _id: user._id,
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      error: false,
      message: "Logged in successfully!",
      user: {
        username: user.username,
        email: user.email,
        age: user.age,
        _id: user._id,
        isEmailVerified: user.isEmailVerified,
        orderAddress: user.orderAddress,
        orderPhone: user.orderPhone,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: true, message: "Internal server error!" });
  }
});

//  GET LOGGED-IN USER
route.get("/user", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: true, message: "Token not provided!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    res.status(200).json({
      error: false,
      message: "User data fetched successfully!",
      data: user,
    });
  } catch (err) {
    console.error("Token validation error:", err);
    res.status(401).json({ error: true, message: "Invalid token!" });
  }
});


//  FORGOT PASSWORD
route.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"MyApp Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password. This link expires in 15 minutes:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.status(200).json({ error: false, message: "Reset email sent!" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: true, message: "Something went wrong!" });
  }
});

//  RESET PASSWORD
route.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found!" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(200).json({ error: false, message: "Password reset successful!" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(400).json({ error: true, message: "Invalid or expired reset token!" });
  }
});

export default route;
