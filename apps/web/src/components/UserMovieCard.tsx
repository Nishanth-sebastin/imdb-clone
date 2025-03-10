
import { Movie } from '@/types/movie';
import { Edit, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserMovieCardProps {
  movie: Movie;
}

export default function UserMovieCard({ movie }: UserMovieCardProps) {
  return (
    <div className="movie-card group" style={{ opacity: 0 }} onLoad={(e) => {
      // Animation when card loads
      const target = e.currentTarget;
      target.style.opacity = '0';
      setTimeout(() => {
        target.style.transition = 'opacity 0.5s ease-in-out';
        target.style.opacity = '1';
      }, 100);
    }}>
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={movie.posterUrl} 
          alt={movie.title}
          className="movie-card-image group-hover:scale-105"
          loading="lazy"
        />
        <div className="movie-card-overlay flex-col space-y-3">
          <Link 
            to={`/movie/${movie.id}`}
            className="w-full py-2 flex items-center justify-center space-x-2 
                     bg-cinema-800/90 text-white font-medium rounded-md 
                     hover:bg-cinema-700 transition-all"
          >
            <Eye className="h-4 w-4" />
            <span>View</span>
          </Link>
          <Link 
            to={`/edit-movie/${movie.id}`}
            className="w-full py-2 flex items-center justify-center space-x-2 
                     bg-gold/90 text-black font-medium rounded-md 
                     hover:bg-gold transition-all"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Link>
        </div>
      </div>
      <div className="movie-card-content">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-gold transition-colors">
            {movie.title}
          </h3>
          <span className="text-sm text-cinema-400">{movie.year}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-gold" />
          <span className="text-sm">
            {movie.rating > 0 ? movie.rating.toFixed(1) : 'No ratings'}
          </span>
        </div>
      </div>
    </div>
  );
}
