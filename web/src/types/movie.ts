export interface Movie {
  id: string;
  title: string;
  year: number;
  posterUrl: string;
  additionalImages?: string[];
  actors: string[];
  overall_ratings: number;
  description: string;
  createdById: string | null;
  createdByName: string | null;
  rating: number;
  reviews: Review[];
  rating_count: number;
  cast: CastMember[];
}

export interface CastMember {
  id: string;
  name: string;
  role: 'actor' | 'producer';
  imageUrl?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface MovieFormData {
  title: string;
  year: number;
  posterUrl: string;
  additionalImages?: string[];
  description: string;
  cast: CastMember[];
}

export interface Actor {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface Producer {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface FileUploadResult {
  url: string;
  file: File;
}
