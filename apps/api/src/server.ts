import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';
import authRoutes from './auth.routes';
import imageUploadRoutes from './config/imageUpload';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';
import { getMovies } from './services/movieService';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 8085;
const CLIENT_URL = process.env.WEB_PORT || 'http://localhost:8080';

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);
app.use('/auth', authRoutes);
app.use('/uploads', imageUploadRoutes);
app.use(errorHandler);

// Start the server after connecting to DB
connectDB().then(() => {
  app.listen(PORT, () => console.info(`🚀 Server running at ${CLIENT_URL}:${PORT}`));
});
