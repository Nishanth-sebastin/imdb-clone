// import { fetchActors, fetchProducers, createActor, createProducer } from '@/lib/api';
//

import useAxios from '@/helpers/api';

//eslint-disable-next-line
const axiosClient = useAxios();

export const saveMovie = async (payload: any) => {
  const { data } = await axiosClient.post('/api/movies/', {
    ...payload,
  });
  return data.data;
};

export const updateMovie = async (id: string, payload: any) => {
  const { data } = await axiosClient.patch(`/api/movies/${id}`, {
    ...payload,
  });
  return data.data;
};

export const getMovies = async () => {
  const { data } = await axiosClient.get('/api/movies');
  return data.data;
};

export const getMoviesById = async (id: string) => {
  const { data } = await axiosClient.get(`/api/movies/${id}`);
  return data.data;
};

export const getMovieFeedback = async (id: string) => {
  const { data } = await axiosClient.get(`/api/movies/${id}/feedback`);
  return data.data;
};

export const addReview = async (id: string, review: any) => {
  const { data } = await axiosClient.post(`/api/movies/${id}/feedback`, {
    review,
  });
  return data.data;
};
