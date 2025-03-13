import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';
import authRoutes from './auth.routes';
import imageUploadRoutes from './config/imageUpload';
import connectDB from './config/db';
import authMiddleware from './middlewares/auth';
import cookieParser from 'cookie-parser';
import { getMovies } from './services/movieService';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 8085;
const CLIENT_URL = process.env.WEB_PORT || 'http://localhost:8080';

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());
app.use(cookieParser());

app.get('/allmovies', async (req, res) => {
  try {
    const movies = await getMovies();
    let formattedMovies = [];

    formattedMovies = movies.map((movie) => ({
      id: movie._id.toString(),
      title: movie.title,
      year: movie.year,
      images: movie.images,
      overall_ratings: movie.overall_ratings,
    }));

    res.json({ data: formattedMovies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use('/api', authMiddleware, routes);
app.use('/auth', authRoutes);
app.use('/uploads', imageUploadRoutes);
app.use(errorHandler);

// Start the server after connecting to DB
connectDB().then(() => {
  app.listen(PORT, () => console.info(`🚀 Server running at ${CLIENT_URL}:${PORT}`));
});
