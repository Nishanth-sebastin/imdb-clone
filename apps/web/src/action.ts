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

export const getUserMovies = async () => {
  const { data } = await axiosClient.get('/api/movies/usermovies');
  return data.data;
};

export const getCommunityMovies = async () => {
  const { data } = await axiosClient.get('/api/movies/communitymovies');
  return data.data;
};

export const getAllMovies = async () => {
  const { data } = await axiosClient.get('/allmovies');
  return data.data;
};

export const getMoviesById = async (id: string) => {
  const { data } = await axiosClient.get(`/api/movies/${id}`);
  return data.data;
};
