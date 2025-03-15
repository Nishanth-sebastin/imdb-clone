import cors from 'cors';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes.js';
import authRoutes from './auth.routes.js';
import imageUploadRoutes from './config/imageUpload.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8085;

// const CLIENT_URLS = [process.env.VITE_WEB_URL, 'http://localhost:8080'].filter(Boolean) as string[];

// Middleware
app.use(
  cors({
    origin: "https://remarkable-stroopwafel-b96c4c.netlify.app",
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
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});
app.get('/api/health', (req: Request, res: Response) => {
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
