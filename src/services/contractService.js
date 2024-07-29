import { api } from '../lib/api/config';

export const getContract = async (page, pageSize) => {
  try {
    const response = await api.get('/', {
      params: {
        page,
        pageSize
      }
    });
    return { type: 'success', data: response.data};
  } catch (error) {
    return { type: 'error', error };
  }
};

export const getContractById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return { type: 'success', data: response.data};
  } catch (error) {
    return { type: 'error', error };
  }
};

export const createContract = async (data) => {
  try {
    const response = await api.post('/', data);
    return { type: 'success', data: response.data};
  } catch (error) {
    return { type: 'error', error };
  }
};

export const editContract = async (id, data) => {
  try {
    const response = await api.patch(`/${id}`, data);
    return { type: 'success', data: response.data};
  } catch (error) {
    return { type: 'error', error };
  }
};

export const switchContractStatus = async (id) => {
  try {
    const response = await api.patch(`/changeStatus/${id}`);
    console.log(response.data.data)
    return { type: 'success', data: response.data};
  } catch (error) {
    return { type: 'error', error };
  }
};