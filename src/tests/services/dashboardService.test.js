import { getDashboardData, getFiltroOpcoes } from '../../services/dasboardService';
import { api } from '../../lib/api/config';

jest.mock('../../lib/api/config.js', () => ({
    api: {
        get: jest.fn(), 
    },
}));

describe('dashboard service endpoints', () => {

    beforeEach(() => {
        jest.clearAllMocks(); 
    });

    it('should fetch filter options successfully', async () => {
        const mockResponse = { status: 200, data: { periodos: ["2024-08", "2024-09"], cidades: ["City 1", "City 2"], regionais: ["Regional 1", "Regional 2"], unidades: ["Unidade 1", "Unidade 2"] } };
        
        api.get.mockResolvedValue(mockResponse); 

        const result = await getFiltroOpcoes();

        expect(api.get).toHaveBeenCalledWith('/printer/dashboard/filtro-opcoes'); 
        expect(result).toEqual({ type: 'success', data: mockResponse.data }); 
    });

    it('should return error when fetching filter options fails', async () => {
        const mockError = new Error('Error');
        
        api.get.mockRejectedValue(mockError); 

        const result = await getFiltroOpcoes();

        expect(api.get).toHaveBeenCalledWith('/printer/dashboard/filtro-opcoes');
        expect(result).toEqual({ type: 'error', error: mockError });
    });

    it('should fetch dashboard data successfully', async () => {
        const mockResponse = { status: 200, data: { impressoras: [{ numSerie: "XYZ123", modeloId: "Modelo 1", localizacao: "City 1;Regional 1;Unidade 1", dataContador: "2024-08-15T10:00:00Z", contadorAtualPB: 100, contadorAtualCor: 50 }], colorModelIds: ["Modelo 1"], pbModelIds: ["Modelo 2"] } };

        api.get.mockResolvedValue(mockResponse); 

        const result = await getDashboardData();

        expect(api.get).toHaveBeenCalledWith('/printer/dashboard/dashboard-data'); 
        expect(result).toEqual({ type: 'success', data: mockResponse.data }); 
    });

    it('should return error when fetching dashboard data fails', async () => {
        const mockError = new Error('Error');

        api.get.mockRejectedValue(mockError); 

        const result = await getDashboardData();

        expect(api.get).toHaveBeenCalledWith('/printer/dashboard/dashboard-data'); 
        expect(result).toEqual({ type: 'error', error: mockError }); 
    });

});
