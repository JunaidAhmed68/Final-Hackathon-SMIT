import express from 'express';
import { createServer } from 'http';
import connectDB from './config/db.js';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import confirmEmailRoute from './routes/confirmEmailRoute.js';
import aiRoutes from './routes/ai.js';

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