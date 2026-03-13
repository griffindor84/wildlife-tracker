import api from './axios';

export interface Observation {
  id: number;
  user_id: number;
  wildlife_id: number | null;
  wildlife_name?: string;
  location: string;
  notes: string;
  observed_at: string;
  created_at: string;
}

export interface CreateObservationPayload {
  wildlife_id?: number;
  location: string;
  notes: string;
  observed_at?: string;
}

export const getObservations = async (): Promise<Observation[]> => {
  const res = await api.get('/observations');
  return res.data;
};

export const createObservation = async (
  payload: CreateObservationPayload
): Promise<Observation> => {
  const res = await api.post('/observations', payload);
  return res.data;
};

export const deleteObservation = async (id: number): Promise<void> => {
  await api.delete(`/observations/${id}`);
};