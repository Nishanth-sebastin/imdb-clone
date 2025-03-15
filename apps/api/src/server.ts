import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';
import authRoutes from './auth.routes';
import imageUploadRoutes from './config/imageUpload';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const CLIENT_URLS = [process.env.VITE_WEB_URL, 'http://localhost:8080'].filter(Boolean) as string[];

app.use(
  cors({
    origin: CLIENT_URLS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', routes);
app.use('/auth', authRoutes);
app.use('/uploads', imageUploadRoutes);
app.use(errorHandler);

// Database connection
connectDB();

// Start server
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
  console.info(`🚀 Server running on port ${PORT}`);
});

// Export Express app (optional, for testing purposes)
export default app;
