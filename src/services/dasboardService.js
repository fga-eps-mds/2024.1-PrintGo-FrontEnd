import { api } from '../lib/api/config';


export const getFiltroOpcoes = async () => {
  try {
    const response = await api.get(`/printer/dashboard/filtro-opcoes`);
    return { type: 'success', data: response.data };
  } catch (error) {
    return { type: 'error', error };
  }
};

export const getDashboardData = async () => {
  try {
    const response = await api.get(`/printer/dashboard/dashboard-data`);
    return { type: 'success', data: response.data };
  } catch (error) {
    return { type: 'error', error };
  }

};

export const getDashboardPdf = async () => {
  try {
    const response = await api.post(`/printer/dashboard/create-report`);
    return { type: 'success', data: response.data };
  } catch (error) {
    return { type: 'error', error };
  }

};