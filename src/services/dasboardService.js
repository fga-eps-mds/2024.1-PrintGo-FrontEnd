import { api } from '../lib/api/config';

const basePath = "/dashboard"

export const getImpressoesTotais= async () => {
    try {
      const response = await api.get(`${basePath}/total-impressoes`)
      return { type: 'success', data: response.data};
    } catch (error) {
      return { type: 'error', error };
    }
  };