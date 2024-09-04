import { api } from '../lib/api/config';

const basePath = "/contract"

export const getContract = async () => {
  try {
    const response = await api.get(`${basePath}/`);
    return { type: 'success', data: response.data};
  } catch (error) {
    return { type: 'error', error };
  }
};

export const getContractById = async (id) => {
  try {
    const response = await api.get(`${basePath}/${id}`);
    return { type: 'success', data: response.data};
  } catch (error) {
    return { type: 'error', error };
  }
};

export const createContract = async (data) => {
  try {
    const response = await api.post(`${basePath}/create`, data);
    return { type: 'success', data: response.data};
  } catch (error) {
    return { type: 'error', error };
  }
};

export const editContract = async (id, data) => {
  try {
    const response = await api.patch(`${basePath}/${id}`, data);
    return { type: 'success', data: response.data};
  } catch (error) {
    return { type: 'error', error };
  }
};

export const switchContractStatus = async (id) => {
  try {
    const response = await api.patch(`${basePath}/changeStatus/${id}`);
    console.log(response.data.data)
    return { type: 'success', data: response.data};
  } catch (error) {
    return { type: 'error', error };
  }
};