import api from './axios';

export interface Wildlife {
  id: number;
  name: string;
  species: string;
  description: string;
  habitat: string;
  status: string;
  created_at: string;
}

export interface WildlifePayload {
  name: string;
  species?: string;
  description?: string;
  habitat?: string;
  status?: string;
}

export const getWildlife = async (): Promise<Wildlife[]> => {
  const res = await api.get('/wildlife');
  return res.data;
};

export const createWildlife = async (payload: WildlifePayload): Promise<Wildlife> => {
  const res = await api.post('/wildlife', payload);
  return res.data;
};

export const updateWildlife = async (id: number, payload: WildlifePayload): Promise<Wildlife> => {
  const res = await api.put(`/wildlife/${id}`, payload);
  return res.data;
};

export const deleteWildlife = async (id: number): Promise<void> => {
  await api.delete(`/wildlife/${id}`);
};