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
const PORT = process.env.PORT || 8085;

const CLIENT_URLS = [process.env.VITE_WEB_URL, 'http://localhost:8080'].filter(Boolean) as string[];

// Middleware
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

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Database connection and server start
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });

export default app; // For testing purposes
