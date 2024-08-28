import { api } from '../lib/api/config';


export const getImpressoesTotais= async () => {
    try {
      const response = await api.get(`/dashboard/total-impressoes`)
      return { type: 'success', data: response.data};
    } catch (error) {
      return { type: 'error', error };
    }
  };

  export const getImpressorasColoridas= async () => {
    try {
      const response = await api.get(`/dashboard/color-printers`)
      return { type: 'success', data: response.data};
    } catch (error) {
      return { type: 'error', error };
    }
  };