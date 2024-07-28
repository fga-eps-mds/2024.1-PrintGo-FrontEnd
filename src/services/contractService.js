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

export const editContract = async (id, data) => {
  try {
    const response = await api.put(`/contract/${id}`, data);
    return { type: 'success', data: response.data};
  } catch (error) {
    return { type: 'error', error };
  }
};

export const switchContractStatus = async (id) => {
  try {
    const response = await api.patch(`/contract/${id}`);
    console.log(response.data.data)
    return { type: 'success', data: response.data};
  } catch (error) {
    return { type: 'error', error };
  }
};