import api from './axios';

export interface Report {
  id: number;
  user_id: number;
  user_name?: string;
  title: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
}

export interface CreateReportPayload {
  title: string;
  description: string;
}

export const getReports = async (): Promise<Report[]> => {
  const res = await api.get('/reports');
  return res.data;
};

export const createReport = async (payload: CreateReportPayload): Promise<Report> => {
  const res = await api.post('/reports', payload);
  return res.data;
};