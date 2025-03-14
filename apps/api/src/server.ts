import cors from 'cors';
import express from 'express';
import { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';
import authRoutes from './auth.routes';
import imageUploadRoutes from './config/imageUpload';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// Configure CORS for Vercel deployment
const CLIENT_URLS = [process.env.VITE_WEB_URL, 'http://localhost:8080'].filter(Boolean) as string[];

app.use(
  cors({
    origin: CLIENT_URLS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', routes);
app.use('/auth', authRoutes);
app.use('/uploads', imageUploadRoutes);
app.use(errorHandler);

connectDB();

// Vercel serverless function handler
module.exports = (req: VercelRequest, res: VercelResponse) => {
  req.url = `/api${req.url}`;
  return app(req, res);
};

// Local server (optional for development)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8085;
  app.listen(PORT, () => {
    console.info(`🚀 Local server running on port ${PORT}`);
  });
}
