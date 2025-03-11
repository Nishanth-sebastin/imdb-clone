import Movie from '../models/movie.model';

/**
 * Fetch all movies from the database
 * @returns List of movies
 */
export async function getMovies() {
  try {
    return await Movie.find();
  } catch (error) {
    throw new Error(`Error fetching movies: ${(error as Error).message}`);
  }
}

/**
 * Create a new movie in the database
 * @param data Movie details (name, year, producerId, actors)
 * @returns Created movie object
 */
export async function createMovie(data: { name: string; year: number; producerId: string; actors: string[] }) {
  try {
    const movie = new Movie(data);
    return await movie.save();
  } catch (error) {
    throw new Error(`Error creating movie: ${(error as Error).message}`);
  }
}
