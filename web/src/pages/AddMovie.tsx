import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
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
import { useMutation, useQuery } from '@tanstack/react-query';
import { getMoviesById, saveMovie, updateMovie } from '@/action';
import { useQueryEvents } from '@/helpers/useQueryEvents';
import { movieValidationSchema } from '@/schemas';

const AddMovie = () => {
  const { user } = useAuth();
  const { id } = useParams();
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

  const queryResult = useQuery({
    queryKey: ['get_single_movie', id],
    queryFn: async () => await getMoviesById(id),
    enabled: !!id,
  });

  const { isLoading } = useQueryEvents(queryResult, {
    onSuccess: (data) => {
      setTitle(data.title);
      setYear(data.year);
      setDescription(data.description);
      setImages(data.images);
      setCast(data.cast);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: saveMovieMutate } = useMutationEvents(
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

  const { mutate: updateMovieMutate } = useMutationEvents(
    useMutation({
      mutationKey: ['updateMovie'],
      mutationFn: ({ id, title, year, description, images, cast, userId }: any) => {
        return updateMovie(id, {
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
        toast.success('Movie updated successfully');
      },
      onError: (error: any) => {
        setIsSubmitting(false);

        if (error.response && error.response.data.errors) {
          error.response.data.errors.forEach((err: { path: string[]; message: string }) => {
            toast.error(err.message);
          });
        } else {
          toast.error('Failed to update movie. Please try again.');
        }
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = movieValidationSchema.safeParse({
      title,
      year,
      description,
      images,
      cast,
    });

    if (!validationResult.success) {
      validationResult.error.errors.forEach((err) => {
        toast.error(err.message);
      });
      return;
    }

    setIsSubmitting(true);
    if (id) {
      updateMovieMutate({
        id,
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
    } else {
      saveMovieMutate({
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
    }
    // setIsSubmitting(false);
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
            <h1 className="text-2xl font-bold mb-6">{id ? 'Edit' : 'Add New'} Movie</h1>

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
                  {isSubmitting ? (id ? 'Updating Movie...' : 'Adding Movie...') : id ? 'Edit Movie' : 'Add movie'}
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
