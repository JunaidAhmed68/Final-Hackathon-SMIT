// server.js
import express from 'express';
import { createServer } from 'http';
// import { Server } from 'socket.io';
import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import confirmEmailRoute from './routes/confirmEmailRoute.js';
import dotenv from "dotenv";
dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/confirm-email', confirmEmailRoute);
// app.use('/ai', aiRoutes);

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('MongoDB connected!');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
  res.send('get api');
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
