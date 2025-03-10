
import { Movie } from '@/types/movie';
import MovieCard from './MovieCard';
import UserMovieCard from './UserMovieCard';

interface MovieGridProps {
  movies: Movie[];
  isUserMovies?: boolean;
  isLoading?: boolean;
}

export default function MovieGrid({ 
  movies, 
  isUserMovies = false,
  isLoading = false 
}: MovieGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array(10).fill(0).map((_, i) => (
          <div key={i} className="movie-card animate-pulse">
            <div className="aspect-[2/3] w-full bg-cinema-800 rounded-t-lg"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-cinema-800 rounded-full w-3/4"></div>
              <div className="h-3 bg-cinema-800 rounded-full w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="bg-cinema-800 p-8 rounded-lg max-w-md">
          <h3 className="text-xl font-semibold mb-2">No movies found</h3>
          <p className="text-cinema-400">
            {isUserMovies 
              ? "You haven't added any movies yet." 
              : "There are no movies available at the moment."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {movies.map((movie) => 
        isUserMovies ? (
          <UserMovieCard key={movie.id} movie={movie} />
        ) : (
          <MovieCard key={movie.id} movie={movie} />
        )
      )}
    </div>
  );
}
