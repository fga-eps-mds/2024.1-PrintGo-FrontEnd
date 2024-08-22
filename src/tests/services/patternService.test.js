import { createPadraoImpressora, getPadrao, getPadroes, togglePattern, editPadrao } from '../../services/patternService'
import { api } from '../../lib/api/config';

jest.mock('../../lib/api/config.js', () => ({
    api: {
        post: jest.fn(),
        patch: jest.fn(),
        get: jest.fn(),
        put: jest.fn()
    },
}));

describe('pattern endpoints', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    const patternData = {
        modelo: "LaserJetColour",
        marca: "Epston",
        tipo: "Laser Colorido",
        colorido: true,
        oidModelo: "1.3.6.1.2.1.1.9.1.3.4",
        oidNumeroSerie: "1.3.6.1.2.1.1.9.1.3.8",
        oidFirmware: "1.3.6.1.2.1.1.9.1.3.12",
        oidTempoAtivo: "1.3.6.1.2.1.1.9.1.1.27",
        oidDigitalizacoes: null,
        oidCopiasPB: "1.3.6.1.2.1.11.17.0",
        oidCopiasCor: "1.3.6.1.2.1.1.9.1.1.12",
        oidTotalGeral: "1.3.6.1.2.1.1.9.1.1.14"
      }

    it('creates a pattern successfully', async () => {
        api.post.mockResolvedValue({ status: 201, data: "some data" });

        const result = await createPadraoImpressora(patternData);

        expect(api.post).toHaveBeenCalledWith('/printer/padrao/create', patternData);
        expect(result).toEqual({ type: 'success', data: 'some data' });
    });

    it('creates a pattern and returns error status code', async () => {
        api.post.mockResolvedValue({ status: 402, data: "some data" });

        const result = await createPadraoImpressora(patternData);

        expect(api.post).toHaveBeenCalledWith('/printer/padrao/create', patternData);
        expect(result).toEqual({ type: 'error', data: 'some data' });
    });

    it('tries to creates a pattern and throws error', async () => {
        api.post.mockRejectedValue(new Error('error'));

        const result = await createPadraoImpressora(patternData);

        expect(api.post).toHaveBeenCalledWith('/printer/padrao/create', patternData);
        expect(result).toEqual({ type: 'error', error: new Error('error') });
    });

    it('gets patterns successfully', async () => {
        api.get.mockResolvedValue({ status: 200, data: "some data" })

        const result = await getPadroes();

        expect(api.get).toHaveBeenCalledWith('/printer/padrao');
        expect(result).toEqual({ type: 'success', data: 'some data' });
    });

    it('gets patterns and returns error status code', async () => {
        api.get.mockResolvedValue({ status: 404, data: "some data" })

        const result = await getPadroes();

        expect(api.get).toHaveBeenCalledWith('/printer/padrao');
        expect(result).toEqual({ type: 'error', data: 'some data' });
    });

    it('tries to get patterns and throws error', async () => {
        api.get.mockRejectedValue(new Error('error'))

        const result = await getPadroes();

        expect(api.get).toHaveBeenCalledWith('/printer/padrao');
        expect(result).toEqual({ type: 'error', error: new Error('error') });
    });

    it('gets a pattern by id successfully', async () => {
        const id = 1;
        api.get.mockResolvedValue({ status: 200, data: "some data" })

        const result = await getPadrao(id);

        expect(api.get).toHaveBeenCalledWith(`/printer/padrao/${id}`);
        expect(result).toEqual({ type: 'success' });
    });

    it('gets a pattern by id and returns error status code', async () => {
        const id = 2;
        api.get.mockResolvedValue({ status: 404, data: "some data" })

        const result = await getPadrao(id);

        expect(api.get).toHaveBeenCalledWith(`/printer/padrao/${id}`);
        expect(result).toEqual({ type: 'error' });
    });

    it('gets a pattern by id and throws error', async () => {
        const id = 3;
        api.get.mockRejectedValue(new Error('error'));

        const result = await getPadrao(id);

        expect(api.get).toHaveBeenCalledWith(`/printer/padrao/${id}`);
        expect(result).toEqual({ type: 'error', error: new Error('error') });
    });

    it('edits a pattern successfully', async () => {
        const id = 3;

        api.put.mockResolvedValue({ status: 200, data: 'some data' });

        const result = await editPadrao(patternData, id);

        expect(result).toEqual({ type: 'success', data: 'some data' });
        expect(api.put).toHaveBeenCalledWith(`/printer/padrao/${id}`, patternData);
    });

    it('edits a pattern and return error status code', async () => {
        const id = 2;

        api.put.mockResolvedValue({ status: 400, data: 'some data' });

        const result = await editPadrao(patternData, id);

        expect(result).toEqual({ type: 'error', data: 'some data' });
        expect(api.put).toHaveBeenCalledWith(`/printer/padrao/${id}`, patternData);
    });

    it('tries to edit a pattern and throws error', async () => {
        const id = 12;

        api.put.mockRejectedValue(new Error('error'));

        const result = await editPadrao(patternData, id);

        expect(result).toEqual({ type: 'error', error: new Error('error') });
        expect(api.put).toHaveBeenCalledWith(`/printer/padrao/${id}`, patternData);
    });

    it('toggles pattern successfully', async () => {
        const id = 12;

        api.patch.mockResolvedValue({ status: 200, data: 'some data' })

        const result = await togglePattern(id);

        expect(api.patch).toHaveBeenCalledWith(`/printer/padrao/toggle/${id}`);
        expect(result).toEqual({type: 'success'});
    });

    it('toggles pattern and returns error status code', async () => {
        const id = 13;

        api.patch.mockResolvedValue({ status: 400, data: 'some data' })

        const result = await togglePattern(id);

        expect(api.patch).toHaveBeenCalledWith(`/printer/padrao/toggle/${id}`);
        expect(result).toEqual({ type: 'error'});
    });

    it('toggles a printer and throws error', async () => {
        const id = 14;

        api.patch.mockRejectedValue(new Error('error'));

        const result = await togglePattern(id);

        expect(api.patch).toHaveBeenCalledWith(`/printer/padrao/toggle/${id}`);
        expect(result).toEqual({ type: 'error', error: new Error('error') });
    });
});