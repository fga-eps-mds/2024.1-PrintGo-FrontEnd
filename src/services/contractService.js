import { api } from '../lib/api/config';

export const getContract = async (numero, page, pageSize) => {
  try {
    const response = await api.get('/contract/', {
      params: {
        numero,
        page,
        pageSize
      }
    });
    return { type: 'success', data: response.data};
  } catch (error) {
    return { type: 'error', error };
  }
};

export const createContract = async (data) => {
  try {
    const response = await api.post('/contract/', data);
    return { type: 'success', data: response.data};
  } catch (error) {
    return { type: 'error', error };
  }
};