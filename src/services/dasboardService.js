import { api } from '../lib/api/config';


export const getImpressoesTotais = async (filters) => {
  try {
      const response = await api.get(`http://localhost:8001/dashboard/total-impressoes`, {
          params: filters 
      });
      return { type: 'success', data: response.data };
  } catch (error) {
      return { type: 'error', error };
  }
};
export const getFiltroOpcoes = async () => {
  try {
      const response = await api.get(`http://localhost:8001/dashboard/filtro-opcoes`);
      return { type: 'success', data: response.data };
  } catch (error) {
      return { type: 'error', error };
  }
};

export const getImpressorasColoridas = async (filters) => {
  try {
    const response = await api.get(`http://localhost:8001/dashboard/color-printers`, {
      params: filters // Adiciona os filtros como parâmetros na requisição
    });
    return { type: 'success', data: response.data };
  } catch (error) {
    return { type: 'error', error };
  }
};

export const getImpressorasPB = async (filters) => {
  try {
    const response = await api.get(`http://localhost:8001/dashboard/pb-printers`, {
      params: filters // Adiciona os filtros como parâmetros na requisição
    });
    return { type: 'success', data: response.data };
  } catch (error) {
    return { type: 'error', error };
  }
};

export const getImpressionsByLocation = async () => {
  try {
      const response = await api.get(`http://localhost:8001/dashboard/all-printers-data`);
      return { type: 'success', data: response.data };
  } catch (error) {
      return { type: 'error', error };
  }
};