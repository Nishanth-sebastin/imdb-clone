import { useState, useEffect } from 'react';
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
import MovieImageSelector from '@/components/MovieImageSelector';
import { CastMember } from '@/types/movie';
import CastCrewSelector from '@/components/CaseCrewSelector';
import { useMutationEvents } from '@/helpers/useMutationEvents';
import { useMutation } from '@tanstack/react-query';
import { saveMovie } from '@/action';

const AddMovie = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate('/');
    toast.error('You must be logged in to add a movie');
    return null;
  }

  const { mutate } = useMutationEvents(
    useMutation({
      mutationKey: ['saveMovie'],
      mutationFn: ({ title, year, description, images, cast, userId }: any) => {
        return saveMovie({
          title,
          year,
          description,
          images,
          cast,
          userId: user.id,
        });
      },
    }),
    {
      onSuccess: () => {
        setIsSubmitting(false);
        navigate('/');
        toast.success('Movie added successfully');
      },
      onError: () => {
        setIsSubmitting(false);
        toast.error('Failed to add movie');
      },
    }
  );
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !year || !description) {
      toast.error('Please fill out all required fields');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one image for the movie poster');
      return;
    }

    // Ensure at least one cast member (either actor or producer)
    if (cast.length === 0) {
      toast.error('Please add at least one cast or crew member');
      return;
    }

    // Validate that all cast members have names
    const invalidCastMembers = cast.filter((member) => !member.name.trim());
    if (invalidCastMembers.length > 0) {
      toast.error('All cast and crew members must have names');
      return;
    }

    setIsSubmitting(true);
    mutate({
      title,
      year,
      images,
      posterUrl: images[0],
      additionalImages: images.slice(1),
      description,
      cast,
      userId: user.id,
      userName: user.name,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />

      <main className="flex-1 page-container">
        <div className="max-w-3xl mx-auto animate-scale-in">
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

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
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
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter movie description"
                      className="input-field min-h-[150px]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <MovieImageSelector value={images} onChange={setImages} />
                </div>
              </div>

              <div className="border-t border-cinema-800 pt-6">
                <CastCrewSelector cast={cast} onChange={setCast} />
              </div>

              <div className="pt-4 border-t border-cinema-800">
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
