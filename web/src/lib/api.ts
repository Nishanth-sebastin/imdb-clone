
import { Movie, MovieFormData, Review } from '@/types/movie';

// Mock data
let movies: Movie[] = [
  {
    id: '1',
    title: 'The Shawshank Redemption',
    year: 1994,
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop',
    actors: ['Tim Robbins', 'Morgan Freeman'],
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    createdById: null,
    createdByName: null,
    rating: 9.3,
    reviews: [
      {
        id: '101',
        userId: '2',
        userName: 'Jane Smith',
        rating: 9,
        comment: 'A timeless classic that never fails to inspire.',
        createdAt: '2023-01-15T12:00:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'The Godfather',
    year: 1972,
    posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop',
    actors: ['Marlon Brando', 'Al Pacino'],
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    createdById: null,
    createdByName: null,
    rating: 9.2,
    reviews: []
  },
  {
    id: '3',
    title: 'Inception',
    year: 2010,
    posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=500&auto=format&fit=crop',
    actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    createdById: null,
    createdByName: null,
    rating: 8.8,
    reviews: []
  },
  {
    id: '4',
    title: 'Pulp Fiction',
    year: 1994,
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=500&auto=format&fit=crop',
    actors: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    createdById: null,
    createdByName: null,
    rating: 8.9,
    reviews: []
  },
  {
    id: '5',
    title: 'The Dark Knight',
    year: 2008,
    posterUrl: 'https://images.unsplash.com/photo-1497124401559-3e75ec2ed794?q=80&w=500&auto=format&fit=crop',
    actors: ['Christian Bale', 'Heath Ledger'],
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    createdById: '1',
    createdByName: 'John Doe',
    rating: 9.0,
    reviews: []
  },
  {
    id: '6',
    title: 'Fight Club',
    year: 1999,
    posterUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=500&auto=format&fit=crop',
    actors: ['Brad Pitt', 'Edward Norton'],
    description: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.',
    createdById: '1',
    createdByName: 'John Doe',
    rating: 8.8,
    reviews: []
  }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all movies
export const getAllMovies = async (): Promise<Movie[]> => {
  await delay(600);
  return [...movies];
};

// Get movies by user ID
export const getMoviesByUserId = async (userId: string): Promise<Movie[]> => {
  await delay(600);
  return movies.filter(movie => movie.createdById === userId);
};

// Get movies not created by user
export const getMoviesNotByUserId = async (userId: string): Promise<Movie[]> => {
  await delay(600);
  return movies.filter(movie => movie.createdById !== userId);
};

// Get movie by ID
export const getMovieById = async (id: string): Promise<Movie | null> => {
  await delay(400);
  const movie = movies.find(m => m.id === id);
  return movie || null;
};

// Create a new movie
export const createMovie = async (movieData: MovieFormData, userId: string, userName: string): Promise<Movie> => {
  await delay(800);
  
  const newMovie: Movie = {
    id: Date.now().toString(),
    ...movieData,
    actors: movieData.actors.split(',').map(actor => actor.trim()),
    createdById: userId,
    createdByName: userName,
    rating: 0,
    reviews: []
  };
  
  movies = [...movies, newMovie];
  return newMovie;
};

// Update a movie
export const updateMovie = async (id: string, movieData: MovieFormData): Promise<Movie> => {
  await delay(800);
  
  const index = movies.findIndex(m => m.id === id);
  if (index === -1) throw new Error('Movie not found');
  
  const updatedMovie: Movie = {
    ...movies[index],
    ...movieData,
    actors: movieData.actors.split(',').map(actor => actor.trim()),
  };
  
  movies[index] = updatedMovie;
  return updatedMovie;
};

// Delete a movie
export const deleteMovie = async (id: string): Promise<void> => {
  await delay(600);
  movies = movies.filter(m => m.id !== id);
};

// Add review to a movie
export const addReview = async (
  movieId: string, 
  userId: string, 
  userName: string, 
  rating: number, 
  comment: string
): Promise<Movie> => {
  await delay(600);
  
  const index = movies.findIndex(m => m.id === movieId);
  if (index === -1) throw new Error('Movie not found');
  
  const newReview: Review = {
    id: Date.now().toString(),
    userId,
    userName,
    rating,
    comment,
    createdAt: new Date().toISOString()
  };
  
  // Calculate new average rating
  const currentReviews = movies[index].reviews;
  const allRatings = [...currentReviews.map(r => r.rating), rating];
  const newAverageRating = allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;
  
  const updatedMovie: Movie = {
    ...movies[index],
    reviews: [...currentReviews, newReview],
    rating: parseFloat(newAverageRating.toFixed(1))
  };
  
  movies[index] = updatedMovie;
  return updatedMovie;
};
