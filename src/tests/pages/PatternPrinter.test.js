import React from 'react';
import { render as rtlRender, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as router from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import PatternPrinter from '../../pages/PatternPrinter';
import { createPadraoImpressora } from '../../services/patternService';
import { toast } from 'react-toastify';

jest.mock('../../services/patternService', () => ({
    createPadraoImpressora: jest.fn(),
}));

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

function render(ui, { route = '/', ...renderOptions } = {}) {
    window.history.pushState({}, 'Test page', route);

    function Wrapper({ children }) {
        return <Router>{children}</Router>;
    }

    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

describe('PatternPrinterPage', () => {
    beforeEach(() => {
        router.useNavigate.mockImplementation(jest.requireActual('react-router-dom').useNavigate);
        jest.clearAllMocks();
    });

    it('changes input fields', () => {
        render(<PatternPrinter />);

        const tipoInput = screen.getByPlaceholderText(/digite tipo/i);
        const marcaInput = screen.getByPlaceholderText(/digite marca/i);
        const modeloInput = screen.getByPlaceholderText(/digite modelo/i);

        fireEvent.change(tipoInput, { target: { value: 'Laser' } });
        fireEvent.change(marcaInput, { target: { value: 'HP' } });
        fireEvent.change(modeloInput, { target: { value: 'Modelo123' } });

        expect(tipoInput.value).toBe('Laser');
        expect(marcaInput.value).toBe('HP');
        expect(modeloInput.value).toBe('Modelo123');
    });

    it('enables the submit button when all required fields are filled', () => {
        render(<PatternPrinter />);

        const tipoInput = screen.getByPlaceholderText(/digite tipo/i);
        const marcaInput = screen.getByPlaceholderText(/digite marca/i);
        const modeloInput = screen.getByPlaceholderText(/digite modelo/i);
        const submitButton = screen.getByText(/REGISTRAR/i);

        expect(submitButton).toBeDisabled();

        fireEvent.change(tipoInput, { target: { value: 'Laser' } });
        fireEvent.change(marcaInput, { target: { value: 'HP' } });
        fireEvent.change(modeloInput, { target: { value: 'Modelo123' } });

        expect(submitButton).not.toBeDisabled();
    });

    it('submits the form successfully', async () => {
        createPadraoImpressora.mockResolvedValue({ type: 'success' });

        render(<PatternPrinter />);

        const tipoInput = screen.getByPlaceholderText(/digite tipo/i);
        const marcaInput = screen.getByPlaceholderText(/digite marca/i);
        const modeloInput = screen.getByPlaceholderText(/digite modelo/i);
        const submitButton = screen.getByText(/REGISTRAR/i);

        fireEvent.change(tipoInput, { target: { value: 'Laser' } });
        fireEvent.change(marcaInput, { target: { value: 'HP' } });
        fireEvent.change(modeloInput, { target: { value: 'Modelo123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(createPadraoImpressora).toHaveBeenCalledWith({
                tipo: 'Laser',
                marca: 'HP',
                modelo: 'Modelo123',
                colorido: false,
                oidModelo: null,
                oidNumeroSerie: null,
                oidFirmware: null,
                oidTempoAtivo: null,
                oidDigitalizacoes: null,
                oidCopiasPB: null,
                oidCopiasCor: null,
                oidTotalGeral: null,
            });

            expect(toast.success).toHaveBeenCalledWith('Padrao de impressora criado com sucesso!');
        });
    });

    it('shows error toast on form submission failure', async () => {
        createPadraoImpressora.mockResolvedValue({ type: 'error' });

        render(<PatternPrinter />);

        const tipoInput = screen.getByPlaceholderText(/digite tipo/i);
        const marcaInput = screen.getByPlaceholderText(/digite marca/i);
        const modeloInput = screen.getByPlaceholderText(/digite modelo/i);
        const submitButton = screen.getByText(/REGISTRAR/i);

        fireEvent.change(tipoInput, { target: { value: 'Inkjet' } });
        fireEvent.change(marcaInput, { target: { value: 'HP' } });
        fireEvent.change(modeloInput, { target: { value: 'LaserJet' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Erro ao criar o padrao de impressora!');
        });
    });
});
