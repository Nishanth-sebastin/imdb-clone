
export interface Movie {
  id: string;
  title: string;
  year: number;
  posterUrl: string;
  actors: string[];
  description: string;
  createdById: string | null;
  createdByName: string | null;
  rating: number;
  reviews: Review[];
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
  actors: string;
  description: string;
}
