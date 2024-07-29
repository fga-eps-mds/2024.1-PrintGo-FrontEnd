import { api } from "../lib/api/config";

    export async function getPadrao(id) {
        try {
        const response = await api.get(`/padrao/${id}`);
        if(response.status !== 200) {
            return { type: 'error'};
        }
        return { type: 'success'};
        } catch (error) {
        return { type: 'error', error };
        }
    }
  
  export async function getPadroes() {
    try {
      const response = await api.get('/padrao');
      if(response.status !== 200) {
        return { type: 'error', data: response.data};
      }
      return { type: 'success', data: response.data };
    } catch (error) {
      return { type: 'error', error };
    }
  }
  
  export async function togglePattern(id) {
  
    try {
      const response = await api.patch(`/padrao/toggle/${id}`);
      if(response.status !== 200) {
        return { type: 'error'};
      }
      return { type: 'success'};
    } catch (error) {
      return { type: 'error', error };
    }
  }
  
  
  export const createPadraoImpressora = async (printerPattern) => {
    try {
      const response = await api.post('/padrao/create', printerPattern);
      if(response.status !== 201) {
        return { type: 'error', data: response.data};
      }
      return { type: 'success', data: response.data};
    } catch (error) {
      return { type: 'error', error };
    }
  };
  
  export const editPadrao = async (pattern) => {
    try {
      const data = {
        tipo: pattern.tipo,
        marca: pattern.marca,
        modelo: pattern.modelo,
        modeloImpressora: pattern.modeloImpressora,
        numeroSerie: pattern.numeroSerie,
        versaoFirmware: pattern.versaoFirmware,
        tempoAtivoSistema: pattern.tempoAtivoSistema,
        totalDigitalizacoes: pattern.totalDigitalizacoes,
        totalCopiasPB: pattern.totalCopiasPB,
        totalCopiasColoridas: pattern.totalCopiasColoridas,
        totalImpressoesPb: pattern.totalImpressoesPb,
        totalImpressoesColoridas: pattern.totalImpressoesColoridas,
        totalGeral: pattern.totalGeral,
        enderecoIp: pattern.enderecoIp,
      }
      
      const response = await api.patch(`/printer/padrao/${pattern.id}`, data);
      
      if (response.status !== 200) {
        return { type: 'error', data: response.data };
      }
      
      return { type: 'success', data: response.data };
      
    } catch (error) {
      return { type: 'error', error };
    }
  }
  