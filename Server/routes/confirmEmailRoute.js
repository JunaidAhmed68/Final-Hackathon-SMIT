// import nodemailer from "nodemailer";
// // import dotenv from "dotenv";
// import express from "express";
// import User from "../models/user.js";
// const router = express.Router();
// // dotenv.config();


// const verificationCodes = {};

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendVerificationEmail = async (email) => {
//   const code = Math.floor(100000 + Math.random() * 900000).toString(); // store as string
//   await transporter.sendMail({
//     from: `"Verify Account" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Email Verification Code",
//     html: `
//   <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eaeaea; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
//     <h2 style="text-align: center; color: #3b82f6;">${process.env.EMAIL_USER}</h2>
//     <p style="font-size: 16px; color: #333;">
//       Hello,
//     </p>
//     <p style="font-size: 16px; color: #333;">
//       Thank you for registering. Please use the code below to verify your email address:
//     </p>
//     <div style="text-align: center; margin: 30px 0;">
//       <span style="display: inline-block; background-color: #3b82f6; color: white; padding: 15px 30px; font-size: 24px; border-radius: 8px; letter-spacing: 4px;">
//         ${code}
//       </span>
//     </div>
//     <p style="font-size: 14px; color: #777;">
//       This code will expire in 5 minutes. If you didn't request this, please ignore this email.
//     </p>
//     <p style="font-size: 14px; color: #777; margin-top: 40px;">
//       —My App Team
//     </p>
//   </div>
// `,
//   });

//   verificationCodes[email] = {
//     code,
//     expires: Date.now() + 5 * 60 * 1000,
//   };

//   return code;
// };

// const verifyCode = (email, inputCode) => {
//   const record = verificationCodes[email];

//   if (!record) return { success: false, message: "No code sent" };
//   if (Date.now() > record.expires)
//     return { success: false, message: "Code expired" };
//   if (record.code !== inputCode.toString().trim())
//     return { success: false, message: "Invalid code" };

//   delete verificationCodes[email];
//   return { success: true, message: "Email verified" };
// };

// router.post("/send", async (req, res) => {
//   const { email } = req.body;
//   const existing = await User.findOne({ email });
//   if (existing) {
//     return res
//       .status(400)
//       .json({ error: true, message: "User already exists!" });
//   }
//   try {
//     await sendVerificationEmail(email);
//     res.json({ success: true, message: "Verification code sent to email" });
//   } catch (err) {
//     console.error("Error sending email:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// router.post("/verify", async (req, res) => {
//   const { email, code } = req.body;
//   if (!email || !code) {
//     return res.status(400).json({ message: "Email and code required" });
//   }

//   const result = verifyCode(email, code);
//   if (!result.success) {
//     return res.status(400).json({ message: result.message });
//   }
//   return res.status(200).json({ success: true, message: "Email verified" });
// });

// export default router;


import express from 'express';
import nodemailer from 'nodemailer';
import User from '../models/user.js';

const router = express.Router();

const verificationCodes = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendVerificationEmail = async (email) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await transporter.sendMail({
    from: `"Verify Account" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Email Verification Code',
    html: `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eaeaea; padding: 20px; border-radius: 10px; background-color: #f9f9f9;"><h2 style="text-align: center; color: #3b82f6;">${process.env.EMAIL_USER}</h2><p style="font-size: 16px; color: #333;">Hello,</p><p style="font-size: 16px; color: #333;">Thank you for registering. Please use the code below to verify your email address:</p><div style="text-align: center; margin: 30px 0;"><span style="display: inline-block; background-color: #3b82f6; color: white; padding: 15px 30px; font-size: 24px; border-radius: 8px; letter-spacing: 4px;">${code}</span></div><p style="font-size: 14px; color: #777;">This code will expire in 5 minutes. If you didn't request this, please ignore this email.</p><p style="font-size: 14px; color: #777; margin-top: 40px;">—HealthMate Team</p></div>`,
  });

  verificationCodes[email] = { code, expires: Date.now() + 5 * 60 * 1000 };
  return code;
};

const verifyCode = (email, inputCode) => {
  const record = verificationCodes[email];
  if (!record) return { success: false, message: 'No code sent' };
  if (Date.now() > record.expires) return { success: false, message: 'Code expired' };
  if (record.code !== inputCode.toString().trim()) return { success: false, message: 'Invalid code' };

  delete verificationCodes[email];
  return { success: true, message: 'Email verified' };
};

router.post('/send', async (req, res) => {
  const { email } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ error: true, message: 'User already exists!' });
  }
  try {
    await sendVerificationEmail(email);
    res.json({ success: true, message: 'Verification code sent to email' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/verify', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ message: 'Email and code required' });
  }

  const result = verifyCode(email, code);
  if (!result.success) {
    return res.status(400).json({ message: result.message });
  }
  res.status(200).json({ success: true, message: 'Email verified' });
});

export default router;