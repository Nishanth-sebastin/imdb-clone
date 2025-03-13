import Movie from '../models/movie.model';

/**
 * Fetch all movies from the database
 * @returns List of movies
 */
export async function getMovies() {
  try {
    return await Movie.find().select('title user year images user_id overall_ratings');
  } catch (error) {
    throw new Error(`Error fetching movies: ${(error as Error).message}`);
  }
}

/**
 * Fetch a movie by its ID from the database
 * @param id Movie ID
 * @returns Movie object
 */
export async function getMoviesById(id: string) {
  try {
    return await Movie.findById(id);
  } catch (error) {
    throw new Error(`Error fetching movies: ${(error as Error).message}`);
  }
}

/**
 * Create a new movie in the database
 * @param data Movie details (name, year, producerId, actors)
 * @returns Created movie object
 */
export async function createMovie(movieData: any, userId: string) {
  try {
    const movie = new Movie({
      ...movieData,
      user_id: userId,
      cast: movieData.cast.map((ref) => ({
        person: ref.id,
        role: ref.role.toLowerCase(),
      })),
    });
    return await movie.save();
  } catch (error) {
    throw new Error(`Error creating movie: ${(error as Error).message}`);
  }
}

/**
 * Update a movie in the database
 * @param data Movie details (name, year, producerId, actors)
 * @returns Updated movie object
 */
export async function updateMovie(movieId: string, movieData: any, userId: string) {
  try {
    const updatedMovie = await Movie.findOneAndUpdate(
      { _id: movieId, user_id: userId }, // Find movie by ID and ensure the user owns it
      {
        title: movieData.title,
        year: movieData.year,
        producer_id: movieData.producerId,
        cast: movieData.cast.map((ref) => ({
          person: ref.id,
          role: ref.role.toLowerCase(),
        })),
      },
      { new: true, runValidators: true }
    );

    if (!updatedMovie) throw new Error('Movie not found or unauthorized');

    return updatedMovie;
  } catch (error) {
    throw new Error(`Error updating movie: ${(error as Error).message}`);
  }
}
