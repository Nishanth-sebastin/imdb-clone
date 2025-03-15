// import { fetchActors, fetchProducers, createActor, createProducer } from '@/lib/api';
//

import useAxios from '@/helpers/api';

//eslint-disable-next-line
const axiosClient = useAxios();

export const fetchActors = async (searchText: string) => {
  const { data } = await axiosClient.get('/api/actors', {
    params: { search: searchText },
  });
  return data.data;
};

export const fetchProducers = async (searchText: string) => {
  const { data } = await axiosClient.get('/api/producers', {
    params: { search: searchText },
  });
  return data.data;
};

export const fetchSingleActor = async (id: string) => {
  const { data } = await axiosClient.get(`/api/actors/${id}`);
  return data.data;
};

export const fetchSingleProducer = async (id: string) => {
  const { data } = await axiosClient.get(`/api/producers/${id}`);
  return data.data;
};
