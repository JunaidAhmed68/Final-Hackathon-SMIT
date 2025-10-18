// // Update server.js
// import express from 'express';
// import { createServer } from 'http';
// import 'dotenv/config';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import authRoutes from './routes/auth.js';
// import confirmEmailRoute from './routes/confirmEmailRoute.js';
// import aiRoutes from './routes/ai.js'; // Add this line
// import dotenv from "dotenv";
// dotenv.config();

// const app = express();
// const httpServer = createServer(app);

// const PORT = process.env.PORT || 3000;

// app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));
// app.use(express.json());

// app.use('/auth', authRoutes);
// app.use('/confirm-email', confirmEmailRoute);
// app.use('/ai', aiRoutes); // Add this line

// mongoose.connect(process.env.MONGODB_URL).then(() => {
//   console.log('MongoDB connected!');
// }).catch((err) => {
//   console.error('MongoDB connection error:', err);
// });

// app.get('/', (req, res) => {
//   res.send('HealthMate API is running!');
// });

// httpServer.listen(PORT, () => {
//   console.log(`Server running on port: ${PORT}`);
// });

import express from 'express';
import { createServer } from 'http';
import connectDB from './config/db.js';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import confirmEmailRoute from './routes/confirmEmailRoute.js'; // Corrected path
import aiRoutes from './routes/ai.js'; // Corrected path

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/confirm-email', confirmEmailRoute);
app.use('/ai', aiRoutes);

connectDB();

app.get('/', (req, res) => res.send('HealthMate API is running!'));

httpServer.listen(PORT, () => console.log(`Server running on port: ${PORT}`));