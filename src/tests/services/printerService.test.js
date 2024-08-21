import { addContadores, createImpressora, editImpressora, getPrinters, addRotina } from '../../services/printerService'
import { api } from '../../lib/api/config';

jest.mock('../../lib/api/config.js', () => ({
    api: {
        post: jest.fn(),
        patch: jest.fn(),
        get: jest.fn(),
    },
}));

describe('printer endpoints', () => {
    const printerData = {
        numContrato: "1",
        numSerie: "12345",
        enderecoIp: "192.168.0.1",
        estaNaRede: true,
        dataInstalacao: "2024-07-27T10:00:00Z",
        dataRetirada: null,
        ativo: true,
        contadorInstalacaoPB: 3000,
        contadorInstalacaoCor: 2000,
        contadorAtualPB: 3500,
        contadorAtualCor: 2200,
        contadorRetiradaPB: 0,
        contadorRetiradaCor: 0,
        localizacao: "Brasilia;Teste;SubTeste",
        modeloId: "2"
    };

    const rotinaData = {
        localizacao: "Brasilia;Teste;SubTeste",
        dataCriado: "2024-07-27",
        dataUltimoUpdate: null,
        cronExpression: "0 0 * * * *",
        ativo: true,
        cidadeTodas: false,
        regionalTodas: false,
        unidadeTodas: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('creates a printer successfully', async () => {
        api.post.mockResolvedValue({ status: 201, data: "some data" });

        const result = await createImpressora(printerData);

        expect(api.post).toHaveBeenCalledWith('/printer', printerData);
        expect(result).toEqual({ type: 'success', data: 'some data' });
    });

    it('creates a printer and returns error status code', async () => {
        api.post.mockResolvedValue({ status: 400, data: "some data" });

        const result = await createImpressora(printerData);

        expect(api.post).toHaveBeenCalledWith('/printer', printerData);
        expect(result).toEqual({ type: 'error', data: 'some data' });
    });

    it('tries to create a printer and throws error', async () => {
        api.post.mockRejectedValue(new Error('error'));

        const result = await createImpressora(printerData);

        expect(api.post).toHaveBeenCalledWith('/printer', printerData);
        expect(result).toEqual({ type: 'error', error: new Error('error') });
    });

    it('gets printers successfully', async () => {
        api.get.mockResolvedValue({ status: 200, data: {data: "some data"}})

        const result = await getPrinters();

        expect(api.get).toHaveBeenCalledWith('/printer');
        expect(result).toEqual({ type: 'success', data: 'some data' });
    });

    it('gets printers and returns error status code', async () => {
        api.get.mockResolvedValue({ status: 400, data: "some data" })

        const result = await getPrinters();

        expect(api.get).toHaveBeenCalledWith('/printer');
        expect(result).toEqual({ type: 'error', data: 'some data' });
    });

    it('tries to get printers and throws different error', async () => {
        api.get.mockRejectedValue(new Error('error'))

        const result = await getPrinters();

        expect(api.get).toHaveBeenCalledWith('/printer');
        expect(result).toEqual({ type: 'error', error: new Error('error') });
    });

    it('edits a printer successfully', async () => {
        api.patch.mockResolvedValue({ status: 200, data: {data: 'some data'}});
        
        const printerUpdateData = {id: 1, ...printerData};

        const result = await editImpressora(printerUpdateData);
        console.log(result);

        expect(result).toEqual({ type: 'success', data: 'some data' });
        expect(api.patch).toHaveBeenCalledWith(`/printer/${printerUpdateData.id}`, printerData);
    });

    it('edits a printer and return error status code', async () => {
        api.patch.mockResolvedValue({ status: 400, data: 'some data' });

        const printerUpdateData = {id: 1, ...printerData};

        const result = await editImpressora(printerUpdateData);
        console.log(result);

        expect(result).toEqual({ type: 'error', data: 'some data' });
        expect(api.patch).toHaveBeenCalledWith(`/printer/${printerUpdateData.id}`, printerData);
    });

    it('tries to edit a printer and throws error', async () => {
        api.patch.mockRejectedValue(new Error('error'));

        const printerUpdateData = {id: 1, ...printerData};

        const result = await editImpressora(printerUpdateData);

        expect(result).toEqual({ type: 'error', error: new Error('error') });
        expect(api.patch).toHaveBeenCalledWith(`/printer/${printerUpdateData.id}`, printerData);
    });

    it('updates printer counters successfully', async () => {
      api.patch.mockResolvedValue({ status: 200, data: 'some data'});

      const updateCounters = {
        id: 1,
        contadorAtualPB: 10,
        contadorAtualCor: 12,
        dataContador: new Date().toISOString()
      }

      const result = await addContadores(updateCounters);

      const { id, ...payload } = updateCounters

      expect(result).toEqual({ type: 'success', data: 'some data' });
      expect(api.patch).toHaveBeenCalledWith(`/printer/contadores/${id}`, payload);
    });

    it('tries to updates printer counters and throws error', async () => {
      api.patch.mockRejectedValue(new Error('error'));

      const updateCounters = {
        id: 1,
        contadorAtualPB: 10,
        contadorAtualCor: 12,
        dataContador: new Date().toISOString()
      }

      const result = await addContadores(updateCounters);

      const { id, ...payload } = updateCounters

      expect(result).toEqual({ type: 'error', error: new Error('error') });
      expect(api.patch).toHaveBeenCalledWith(`/printer/contadores/${id}`, payload);
    });

    it('tries to updates printer counters and returns 400 status code', async () => {
      api.patch.mockResolvedValue({ status: 400, data: 'some data' });

      const updateCounters = {
        id: 999,
        contadorAtualPB: 10,
        contadorAtualCor: 12,
        dataContador: new Date().toISOString()
      }

      const result = await addContadores(updateCounters);

      const { id, ...payload } = updateCounters

      expect(result).toEqual({ type: 'error', data: 'some data' });
      expect(api.patch).toHaveBeenCalledWith(`/printer/contadores/${id}`, payload);
    });

    it('must return success when the routine is created', async () => {
        const mockResponse = { status: 200, data: { id: 1, ...rotinaData } };
    
        api.post.mockResolvedValue(mockResponse);
    
        const result = await addRotina(rotinaData);
    
        expect(result).toEqual({ type: 'success', data: mockResponse.data });
        expect(api.post).toHaveBeenCalledWith('/printer/rotina', {...rotinaData});
      });
    
      it('should return error when status is not 200', async () => {
        const mockResponse = { status: 400, data: { message: 'Erro ao criar rotina' } };
    
        api.post.mockResolvedValue(mockResponse);
    
        const result = await addRotina(rotinaData);
    
        expect(result).toEqual({ type: 'error', data: mockResponse.data });
        expect(api.post).toHaveBeenCalledWith('/printer/rotina', {...rotinaData});
      });
    
      it('should return error when API call fails', async () => {
        const mockError = new Error('Falha na rede');
    
        api.post.mockRejectedValue(mockError);
    
        const result = await addRotina(rotinaData);
    
        expect(result).toEqual({ type: 'error', error: mockError });
        expect(api.post).toHaveBeenCalledWith('/printer/rotina', {...rotinaData});
      });
})
