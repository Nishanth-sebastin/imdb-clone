
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Movie } from '@/types/movie';
import { getAllMovies, getMoviesByUserId, getMoviesNotByUserId } from '@/lib/api';
import Navbar from '@/components/Navbar';
import MovieGrid from '@/components/MovieGrid';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Film, PlusCircle } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const [communityMovies, setCommunityMovies] = useState<Movie[]>([]);
  const [userMovies, setUserMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const [userMoviesData, communityMoviesData] = await Promise.all([
            getMoviesByUserId(user.id),
            getMoviesNotByUserId(user.id)
          ]);
          setUserMovies(userMoviesData);
          setCommunityMovies(communityMoviesData);
        } else {
          const allMovies = await getAllMovies();
          setCommunityMovies(allMovies);
          setUserMovies([]);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      
      <main className="flex-1 page-container">
        {user && (
          <section className="mb-12 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="section-title">
                Your Movies
              </h2>
              <Link to="/add-movie">
                <Button className="bg-gold hover:bg-gold/90 text-cinema-950 font-medium">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Movie
                </Button>
              </Link>
            </div>
            <MovieGrid 
              movies={userMovies} 
              isUserMovies={true} 
              isLoading={isLoading} 
            />
          </section>
        )}
        
        <section className="animate-slide-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-title">
              {user ? 'Community Movies' : 'All Movies'}
            </h2>
            
            {!user && (
              <div className="hidden md:block bg-cinema-800/50 backdrop-blur p-4 rounded-lg border border-cinema-700/50 max-w-xs">
                <p className="text-sm text-cinema-300">
                  Sign in to add your own movies and ratings!
                </p>
              </div>
            )}
          </div>
          <MovieGrid 
            movies={communityMovies} 
            isLoading={isLoading} 
          />
        </section>
        
        {!user && (
          <div className="fixed bottom-6 right-6 md:hidden">
            <Button 
              className="w-12 h-12 rounded-full bg-gold hover:bg-gold/90 text-cinema-950 flex items-center justify-center p-0"
              disabled={true}
            >
              <PlusCircle className="h-6 w-6" />
            </Button>
          </div>
        )}
      </main>
      
      <footer className="border-t border-cinema-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Film className="h-5 w-5 text-gold" />
            <span className="text-lg font-semibold tracking-tight">CinemaGrove</span>
          </div>
          <p className="text-sm text-cinema-400">
            © {new Date().getFullYear()} CinemaGrove. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
