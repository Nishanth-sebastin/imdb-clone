import { Router, Request, Response, NextFunction } from 'express';
import optionalAuthMiddleware from '../middlewares/optionalAuth.js';
import authMiddleware from '../middlewares/auth.js';
import Actor from '../models/actors.model.js';
import Producer from '../models/producer.model.js';
import { createActor, getActorById } from '../services/actorsService.js';
import { createProducer, getProducerById } from '../services/producersService.js';
import { createMovie, getMovieById, getMovies, updateMovie } from '../services/movieService.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { movieValidationSchema } from '../validations/movieValidation.js';
import { MovieType } from '../types/index.js';
import MovieFeedback from '../models/movieFeedback.model.js';
import { processCastMembers, updateExistingMemberReferences, updateReferences } from 'src/helpers/index.js';
import Movie from 'src/models/movie.model.js';
import mongoose from 'mongoose';
import { createFeedback, findFeedbackByMovieAndUser, getMovieFeedbacks, updateFeedback } from 'src/services/movieFeedback.js';
const router = Router();

interface AuthenticatedRequest<T = any> extends Request {
  user?: { user_id: string; name: string; email: string };
  body: T;
}

router.get('/', optionalAuthMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const movies = await getMovies();
    const userId = req.user?.user_id || null;

    const userMovies = userId
      ? movies
        .filter((movie: any) => movie.user_id == userId)
        .map((movie: any) => ({
          id: movie._id,
          title: movie.title,
          year: movie.year,
          images: movie.images,
          overall_ratings: movie.overall_ratings,
        }))
      : [];

    const communityMovies = movies
      .filter((movie: any) => !userId || movie.user_id !== userId)
      .map((movie: any) => ({
        id: movie._id,
        title: movie.title,
        year: movie.year,
        images: movie.images,
        overall_ratings: movie.overall_ratings,
      }));

    res.json({ data: { userMovies, communityMovies } });
  } catch (error) {
    next(error);
  }
});


router.get('/:id', optionalAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const movie = await getMovieById(req.params.id);

    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const response = {
      ...movie,
      cast: movie.cast.map(({ person, role }: any) => ({
        id: person?._id || '',
        name: person?.name || 'Unknown',
        role,
        imageUrl: person?.imageUrl || ''
      })),
      is_user_movie: req.user ? movie.user_id === req.user.user_id : undefined
    };

    res.json({ data: response });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', authMiddleware, validateRequest(movieValidationSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { cast, ...movieData } = req.body;
    const userId = req.user!.user_id;

    const processedCast = await Promise.all(
      cast.map(async ({ id, name, imageUrl, role }: any) => {
        if (id) return { person: id, role };

        const Model = role === 'actor' ? Actor : Producer;
        const { _id } = await Model.create({ name, imageUrl });
        return { person: _id, role };
      })
    );

    const movie = await createMovie(movieData, userId, processedCast);
    res.status(201).json({ data: movie });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const movieId = req.params.id;
    const { cast, ...movieData } = req.body;
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 1. Process new cast members
    const { processedCast } = await processCastMembers(cast);
    await updateMovie(movieId, { ...movieData, cast: processedCast }, userId);

    // 2. Remove the movie ID from all existing actors and producers
    await Promise.all([
      Actor.updateMany({ movies: movieId }, { $pull: { movies: movieId } }),
      Producer.updateMany({ movies: movieId }, { $pull: { movies: movieId } }),
    ]);

    // 3. Update new/existing cast members with the movie ID
    await updateExistingMemberReferences(processedCast, movieId);

    res.status(200).json({ message: 'Movie cast updated successfully' });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:id/feedback",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { userRating, userReview } = req.body;
      const movieId = req.params.id;
      const userId = req.user?.user_id;

      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const feedback = await createFeedback({
        rating: userRating,
        review: userReview,
        user_id: userId,
        movie_id: movieId
      });

      res.status(201).json({ message: "Feedback submitted successfully", feedback });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

router.patch(
  "/:id/feedback",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { userRating, userReview } = req.body;
      const movieId = req.params.id;
      const userId = req.user?.user_id;

      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const feedback = await updateFeedback(movieId, userId, {
        rating: userRating,
        review: userReview,
        updated_at: Date.now()
      });

      if (!feedback) return res.status(404).json({ message: "No feedback found to update" });

      res.status(200).json({ message: "Feedback updated successfully", feedback });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }

  }
);


router.get(
  "/:id/feedback",
  optionalAuthMiddleware,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const movieId = req.params.id;
      const userId = req.user?.user_id;

      let userReview = null;

      if (userId) {
        const userFeedback = await findFeedbackByMovieAndUser(movieId, userId);
        userReview = userFeedback ? {
          userRating: userFeedback.rating,
          userReview: userFeedback.review
        } : null;
      }

      const publicReviews = await getMovieFeedbacks(movieId);

      res.status(200).json({
        data: {
          user_reviews: userReview || {},
          public_reviews: publicReviews.map(review => ({
            rating: review.rating,
            review: review.review,
            user: review.user_id
          }))
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

export default router;
