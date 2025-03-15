
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getMovieById, updateMovie } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const EditMovie = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [actors, setActors] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate('/');
    toast.error('You must be logged in to edit a movie');
    return null;
  }

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const movie = await getMovieById(id);
        
        if (!movie) {
          toast.error('Movie not found');
          navigate('/');
          return;
        }
        
        // Check if user has permission to edit this movie
        if (movie.createdById !== user.id) {
          toast.error('You do not have permission to edit this movie');
          navigate('/');
          return;
        }
        
        setTitle(movie.title);
        setYear(movie.year.toString());
        setPosterUrl(movie.posterUrl);
        setActors(movie.actors.join(', '));
        setDescription(movie.description);
      } catch (error) {
        console.error('Error fetching movie:', error);
        toast.error('Failed to load movie data');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovie();
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !title || !year || !posterUrl || !actors || !description) {
      toast.error('Please fill out all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const yearNum = parseInt(year);
      
      if (isNaN(yearNum) || yearNum < 1888 || yearNum > new Date().getFullYear()) {
        toast.error('Please enter a valid year');
        setIsSubmitting(false);
        return;
      }
      
      await updateMovie(
        id,
        {
          title,
          year: yearNum,
          posterUrl,
          actors,
          description
        }
      );
      
      toast.success('Movie updated successfully');
      navigate('/');
    } catch (error) {
      console.error('Error updating movie:', error);
      toast.error('Failed to update movie');
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

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      
      <main className="flex-1 page-container">
        <div className="max-w-2xl mx-auto animate-scale-in">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="text-cinema-400 hover:text-white hover:bg-cinema-800"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
          
          <div className="bg-cinema-900 rounded-lg border border-cinema-800 p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Movie</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Movie Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter movie title"
                  className="input-field"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Release Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Enter release year"
                  className="input-field"
                  min="1888"
                  max={new Date().getFullYear().toString()}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="poster">Poster URL</Label>
                <Input
                  id="poster"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  placeholder="Enter poster image URL"
                  className="input-field"
                  required
                />
                <p className="text-xs text-cinema-400">
                  Paste a direct link to an image (JPG, PNG, etc.)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="actors">Actors</Label>
                <Input
                  id="actors"
                  value={actors}
                  onChange={(e) => setActors(e.target.value)}
                  placeholder="Enter actors (comma separated)"
                  className="input-field"
                  required
                />
                <p className="text-xs text-cinema-400">
                  E.g. Tom Hanks, Robin Wright, Gary Sinise
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter movie description"
                  className="input-field min-h-[100px]"
                  required
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gold hover:bg-gold/90 text-cinema-950 font-medium h-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating Movie...' : 'Update Movie'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditMovie;
