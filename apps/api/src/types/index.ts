export interface MovieType {
  id: string;
  title: string;
  description: string;
  year: number;
  images: string[];
  cast: {
    id: any;
    name: string;
    role: 'actor' | 'producer';
    imageUrl: string;
  }[];
  overall_ratings: number;
  is_user_movie?: boolean; // Ensure this field is optional in type
}
