import { api } from "../lib/api/config";

export async function getPadrao(id) {
  try {
    const response = await api.get(`/printer/padrao/${id}`);
    if (response.status !== 200) {
      return { type: 'error', data: response.data };
    }
    return { type: 'success', data: response.data };
  } catch (error) {
    return { type: 'error', error };
  }
}

export async function getPadroes() {
  try {
    const response = await api.get('/printer/padrao');
    if (response.status !== 200) {
      return { type: 'error', data: response.data };
    }
    return { type: 'success', data: response.data };
  } catch (error) {
    return { type: 'error', error };
  }
}

export async function togglePattern(id) {

  try {
    const response = await api.patch(`/printer/padrao/toggle/${id}`);
    if (response.status !== 200) {
      return { type: 'error' };
    }
    return { type: 'success' };
  } catch (error) {
    return { type: 'error', error };
  }
}


export const createPadraoImpressora = async (printerPattern) => {
  try {
    const response = await api.post('/printer/padrao/create', printerPattern);
    if (response.status !== 201) {
      return { type: 'error', data: response.data };
    }
    return { type: 'success', data: response.data };
  } catch (error) {
    return { type: 'error', error };
  }
};

export const editPadrao = async (pattern, id) => {
  try {
    const response = await api.put(`/printer/padrao/${id}`, pattern);

    if (response.status !== 200) {
      return { type: 'error', data: response.data };
    }

    return { type: 'success', data: response.data };

  } catch (error) {
    return { type: 'error', error };
  }
}
