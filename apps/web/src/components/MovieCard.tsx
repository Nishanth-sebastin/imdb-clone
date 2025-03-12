import { Movie } from '@/types/movie';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div
      className="movie-card group"
      style={{ opacity: 0 }}
      onLoad={(e) => {
        // Animation when card loads
        const target = e.currentTarget;
        target.style.opacity = '0';
        setTimeout(() => {
          target.style.transition = 'opacity 0.5s ease-in-out';
          target.style.opacity = '1';
        }, 100);
      }}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={movie.images[0]}
          alt={movie.title}
          className="movie-card-image group-hover:scale-105"
          loading="lazy"
        />
        <div className="movie-card-overlay">
          <Link
            to={`/movie/${movie.id}`}
            className="w-full py-2 bg-gold/90 text-black font-medium rounded-md
                     hover:bg-gold transition-all text-center"
          >
            View Details
          </Link>
        </div>
      </div>
      <div className="movie-card-content">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-gold transition-colors">{movie.title}</h3>
          <span className="text-sm text-cinema-400">{movie.year}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-gold" />
          <span className="text-sm">4{/* {movie.rating > 0 ? movie.rating.toFixed(1) : 'No ratings'} */}</span>
        </div>
      </div>
    </div>
  );
}
