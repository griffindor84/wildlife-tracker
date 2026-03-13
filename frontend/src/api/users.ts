import api from './axios';
import { User } from './auth';

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get('/users');
  return res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};