import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
// import { getMovieById, addReview } from '@/lib/api';
import { Movie } from '@/types/movie';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, Edit, Star, User } from 'lucide-react';
import { getMoviesById } from '@/action';
import MovieImageCarousel from '@/components/MovieImageCarousel';

const MovieDetail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const movieData = await getMoviesById(id);

        if (!movieData) {
          toast.error('Movie not found');
          navigate('/');
          return;
        }

        setMovie(movieData);
      } catch (error) {
        console.error('Error fetching movie:', error);
        toast.error('Failed to load movie data');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id, navigate]);

  const handleReviewSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to leave a review');
      return;
    }

    if (!id || !movie) return;

    if (userRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!reviewComment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    // Check if user has already reviewed this movie
    const hasReviewed = movie.reviews.some((review) => review.userId === user.id);
    if (hasReviewed) {
      toast.error('You have already reviewed this movie');
      return;
    }

    // Check if user is trying to review their own movie
    if (movie.createdById === user.id) {
      toast.error('You cannot review your own movie');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedMovie = await addReview(id, user.id, user.name, userRating, reviewComment);

      setMovie(updatedMovie);
      setUserRating(0);
      setReviewComment('');
      toast.success('Review submitted successfully');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-black">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-cinema-800 rounded w-48 mb-4"></div>
            <div className="h-4 bg-cinema-800 rounded w-24"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col min-h-screen bg-black">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
            <Button onClick={() => navigate('/')} className="bg-gold hover:bg-gold/90 text-cinema-950 font-medium">
              Return to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // const canReview = user && movie.createdById !== user.id && !movie.reviews.some((review) => review.userId === user.id);
  // const userHasReviewed = user && movie.reviews.some((review) => review.userId === user.id);
  // const isUserMovie = user && movie.createdById === user.id;

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />

      <main className="flex-1 page-container">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="text-cinema-400 hover:text-white hover:bg-cinema-800 animate-fade-in"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <MovieImageCarousel images={movie.images} altText={movie.title} className="animate-slide-in" />
              {movie.is_user_movie && (
                <div className="mt-4">
                  <Button
                    className="w-full bg-gold hover:bg-gold/90 text-cinema-950 font-medium"
                    onClick={() => navigate(`/edit-movie/${movie.id}`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Movie
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Movie Details */}
          <div className="md:col-span-2 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-cinema-900 rounded-lg border border-cinema-800 p-6">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold">{movie.title}</h1>
                <div className="flex items-center space-x-1 bg-gold/20 px-3 py-1 rounded-full">
                  <Star className="h-5 w-5 text-gold" />
                  {/* <span className="font-semibold text-gold">{movie.rating > 0 ? movie.rating.toFixed(1) : 'N/A'}</span> */}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <div className="flex items-center space-x-1 text-sm bg-cinema-800 rounded-full px-3 py-1">
                  <Calendar className="h-4 w-4 text-cinema-400" />
                  <span>{movie.year}</span>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">About</h2>
                <p className="text-cinema-300 leading-relaxed">{movie.description}</p>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Cast</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor, index) => (
                    <span key={index} className="text-sm bg-cinema-800 rounded-full px-3 py-1">
                      {actor.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Review Form */}
              {/* {canReview && (
                <div className="mt-8 border-t border-cinema-800 pt-6 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>

                  <div className="mb-4">
                    <div className="flex items-center space-x-1 mb-2">
                      <span className="text-sm text-cinema-400 mr-2">Your Rating:</span>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setUserRating(rating)}
                          onMouseEnter={() => setHoverRating(rating)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 focus:outline-none transition-colors"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              (hoverRating ? rating <= hoverRating : rating <= userRating)
                                ? 'text-gold fill-gold'
                                : 'text-cinema-600'
                            }`}
                          />
                        </button>
                      ))}
                      {userRating > 0 && <span className="ml-2 text-gold font-medium">{userRating}/10</span>}
                    </div>

                    <Textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your review here..."
                      className="input-field min-h-[120px] mt-4"
                    />

                    <Button
                      onClick={handleReviewSubmit}
                      className="w-full mt-4 bg-gold hover:bg-gold/90 text-cinema-950 font-medium"
                      disabled={isSubmitting || userRating === 0 || !reviewComment.trim()}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {/* <div className="mt-12 animate-slide-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="section-title mb-6">Reviews</h2>

          {movie.reviews.length === 0 ? (
            <div className="bg-cinema-900 rounded-lg border border-cinema-800 p-6 text-center">
              <p className="text-cinema-400">No reviews yet. Be the first to leave a review!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {movie.reviews.map((review) => (
                <div key={review.id} className="bg-cinema-900 rounded-lg border border-cinema-800 p-6 animate-scale-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{review.userName}</h3>
                      <p className="text-sm text-cinema-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-1 bg-cinema-800 px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 text-gold" />
                      <span className="font-semibold">{review.rating}/10</span>
                    </div>
                  </div>
                  <p className="mt-4 text-cinema-300">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          {userHasReviewed && (
            <div className="mt-8 text-center p-4">
              <p className="text-cinema-400 text-sm">
                You've already reviewed this movie. Thank you for your contribution!
              </p>
            </div>
          )}

          {isUserMovie && (
            <div className="mt-8 text-center p-4">
              <p className="text-cinema-400 text-sm">This is your movie. You cannot review your own content.</p>
            </div>
          )}
        </div> */}
      </main>
    </div>
  );
};

export default MovieDetail;
