import { Router, Request, Response, NextFunction } from 'express';
import optionalAuthMiddleware from '../middlewares/optionalAuth.js';
import authMiddleware from '../middlewares/auth.js';
import Actor from '../models/actors.model.js';
import Producer from '../models/producer.model.js';
import { createActor, getActorById } from '../services/actorsService.js';
import { createProducer, getProducerById } from '../services/producersService.js';
import { createMovie, getMovies, getMoviesById, updateMovie } from '../services/movieService.js';
import { processCastMembers, updateExistingMemberReferences } from '../helpers/index.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { movieValidationSchema } from '../validations/movieValidation.js';
import { MovieType } from '../types/index.js';
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
  const movieId = req.params.id;

  try {
    const movie = await getMoviesById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const castDetails = await Promise.all(
      movie.cast.map(async (castMember: any) => {
        let personDetails: any = null;

        if (castMember.role === 'actor') {
          personDetails = await getActorById(castMember.person);
        } else {
          personDetails = await getProducerById(castMember.person);
        }

        if (!personDetails) {
          return {
            id: castMember.person,
            name: 'Unknown',
            role: castMember.role,
            imageUrl: '',
          };
        }

        return {
          id: personDetails.id || castMember.person,
          name: personDetails.name || 'Unknown',
          role: castMember.role,
          imageUrl: personDetails.imageUrl || '',
        };
      })
    );

    const formattedMovie: MovieType = {
      id: movie._id,
      title: movie.title,
      description: movie.description,
      year: movie.year,
      images: movie.images,
      cast: castDetails,
      overall_ratings: movie.overall_ratings,
    };

    if (req.user) {
      formattedMovie.is_user_movie = movie.user_id === req.user.user_id;
    }

    res.json({ data: formattedMovie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post(
  '/',
  authMiddleware,
  validateRequest(movieValidationSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { cast, ...movieData } = req.body;
      const userId = req.user?.user_id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Process cast members
      const processedCast = await Promise.all(
        cast.map(async (member: any) => {
          try {
            // Existing cast member - just use reference
            if (member.id) return { id: member.id, role: member.role };

            // New cast member - create in appropriate collection
            let result;
            if (member.role === 'actor') {
              result = await createActor({
                name: member.name,
                imageUrl: member.imageUrl,
              });
            } else if (member.role === 'producer') {
              result = await createProducer({
                name: member.name,
                imageUrl: member.imageUrl,
              });
            } else {
              throw new Error(`Invalid role: ${member.role}`);
            }

            return { id: result._id, role: member.role };
          } catch (error) {
            throw new Error(`Failed to process cast member: ${(error as Error).message}`);
          }
        })
      );

      // Create movie with processed cast references
      const newMovie = await createMovie(
        {
          ...movieData,
          cast: processedCast,
        },
        userId
      );

      await Promise.all(
        processedCast.map(({ id, role }) =>
          (role === 'actor' ? Actor : Producer).findByIdAndUpdate(id, { $addToSet: { movies: newMovie._id } })
        )
      );
      res.status(201).json({ data: newMovie });
    } catch (error) {
      next(error);
    }
  }
);

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

export default router;
