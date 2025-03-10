
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { createMovie } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const AddMovie = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [actors, setActors] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate('/');
    toast.error('You must be logged in to add a movie');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !year || !posterUrl || !actors || !description) {
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
      
      await createMovie(
        {
          title,
          year: yearNum,
          posterUrl,
          actors,
          description
        },
        user.id,
        user.name
      );
      
      toast.success('Movie added successfully');
      navigate('/');
    } catch (error) {
      console.error('Error adding movie:', error);
      toast.error('Failed to add movie');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-2xl font-bold mb-6">Add New Movie</h1>
            
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
                  {isSubmitting ? 'Adding Movie...' : 'Add Movie'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddMovie;
