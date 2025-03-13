import { Router } from 'express';
import { mock } from 'node:test';
import optionalAuthMiddleware from 'src/middlewares/optionalAuth';
import authMiddleware from 'src/middlewares/auth';
import Actor from 'src/models/actors.model';
import Producer from 'src/models/producer.model';
import { createActor, getActorById } from 'src/services/actorsService';
import { createProducer, getProducerById } from 'src/services/producersService';
import { createMovie, getMovies, getMoviesById } from '../services/movieService';
import { validateUser } from '../validations/userValidations';

const router = Router();

router.get('/', optionalAuthMiddleware, async (req, res, next) => {
  try {
    const movies = await getMovies();
    const userId = req.user?.user_id || null;

    const userMovies = userId
      ? movies
          .filter((movie) => movie.user_id == userId)
          .map((movie) => ({
            id: movie._id.toString(),
            title: movie.title,
            year: movie.year,
            images: movie.images,
            overall_ratings: movie.overall_ratings,
          }))
      : [];

    const communityMovies = movies
      .filter((movie) => !userId || movie.user_id !== userId)
      .map((movie) => ({
        id: movie._id.toString(),
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

router.get('/:id', optionalAuthMiddleware, async (req, res) => {
  const movieId = req.params.id;

  try {
    const movie = await getMoviesById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const castDetails = await Promise.all(
      movie.cast.map(async (castMember) => {
        let personDetails;
        if (castMember.role === 'actor') {
          personDetails = await getActorById(castMember.person);
        } else {
          personDetails = await getProducerById(castMember.person);
        }

        return {
          id: castMember.id || personDetails.id,
          name: personDetails.name,
          role: castMember.role,
          imageUrl: personDetails.imageUrl || '',
        };
      })
    );

    const formattedMovie = {
      id: movie._id.toString(),
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

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { cast, ...movieData } = req.body;
    const userId = req.user.user_id;
    // Process cast members
    const processedCast = await Promise.all(
      cast.map(async (member) => {
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
          throw new Error(`Failed to process cast member: ${error.message}`);
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
});

export default router;
