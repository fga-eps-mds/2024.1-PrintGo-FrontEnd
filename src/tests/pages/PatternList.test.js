import React from 'react';
import { render as rtlRender, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as router from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import PatternList from '../../pages/PatternList';
import { getPadroes, togglePattern } from '../../services/patternService'

jest.mock('../../services/patternService', () => ({
    getPadroes: jest.fn(),
    togglePattern: jest.fn(),
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

describe('PatternList', () => {
    beforeEach(() => {
        router.useNavigate.mockImplementation(jest.requireActual('react-router-dom').useNavigate);
        jest.clearAllMocks();
    });

    const mockPatternsData = {
        type: 'success',
        data: [
            {
                id: 1,
                ativo: true,
                marca: 'HP',
                modelo: '123',
                tipo: 'Laser',
                colorido: true,
                oidModelo: "1.3.6.1.2.1.1.9.1.3.4",
                oidNumeroSerie: "1.3.6.1.2.1.1.9.1.3.8",
                oidFirmware: "1.3.6.1.2.1.1.9.1.3.12",
                oidTempoAtivo: "1.3.6.1.2.1.1.9.1.1.27",
                oidDigitalizacoes: null,
                oidCopiasPB: "1.3.6.1.2.1.1.9.1.1.12",
                oidCopiasCor: "1.3.6.1.2.1.1.9.1.1.14",
                oidTotalGeral: "1.3.6.1.2.1.1.9.1.1.15"
            },
            {
                id: 2,
                ativo: false,
                marca: 'Epson',
                modelo: '456',
                tipo: 'Inkjet',
                colorido: false,
                oidModelo: "1.3.6.1.2.25",
                oidNumeroSerie: "1.3.6.1.24",
                oidFirmware: "1.3.6.1.2.15",
                oidTempoAtivo: "1.3.6.1.2.1.14",
                oidDigitalizacoes: null,
                oidCopiasPB: "1.3.6.1.2.1.15",
                oidCopiasCor: "1.3.6.1.24",
                oidTotalGeral: "1.3.6.1.2.15"
            },
        ],
    };

    it('renders title', () => {
        render(<PatternList />);

        expect(screen.getByText('Padrões de Impressoras Cadastradas')).toBeInTheDocument();
    });

    it('displays correct filter being shown text', async () => {
        render(<PatternList />);

        await waitFor(() => {
            expect(screen.getByText('Padrões de Impressoras Cadastradas')).toBeInTheDocument();
        });

        const filterBeingShownText = screen.getByTestId('filter_beign_shown');
        expect(filterBeingShownText).toHaveTextContent('Todas');

        fireEvent.click(screen.getByText('Ativas'));

        await waitFor(() => {
            expect(filterBeingShownText).toHaveTextContent('Ativas');
        });

        fireEvent.click(screen.getByText('Desativas'));

        await waitFor(() => {
            expect(filterBeingShownText).toHaveTextContent('Desativadas');
        });

        fireEvent.click(screen.getByText('Todas'));

        await waitFor(() => {
            expect(filterBeingShownText).toHaveTextContent('Todas');
        });
    });

    it('renders patterns correctly', async () => {
        getPadroes.mockResolvedValue(mockPatternsData);

        render(<PatternList />);

        await waitFor(() => {
            expect(screen.getByText('Padrões de Impressoras Cadastradas')).toBeInTheDocument();
            expect(screen.getByText(/HP.*123.*Laser/i)).toBeInTheDocument();
            expect(screen.getByText(/Epson.*456.*Inkjet/i)).toBeInTheDocument();
        });
    });

    it('handle Toggle', async () => {
        getPadroes.mockResolvedValue(mockPatternsData);

        togglePattern.mockResolvedValue({ type: 'success' });

        render(<PatternList />);

        await waitFor(() => {
            expect(screen.getByText('Padrões de Impressoras Cadastradas')).toBeInTheDocument();
            expect(screen.getByText(/HP.*123.*Laser/i)).toBeInTheDocument();
            expect(screen.getByText(/Epson.*456.*Inkjet/i)).toBeInTheDocument();
        });
        

          
        const toggleButtons = screen.getAllByRole('button');
        const toggleButton = toggleButtons[2];
      
        fireEvent.click(toggleButton);
      
        await waitFor(() => {
          expect(screen.getByText(/Epson.*456.*Inkjet/i)).toHaveStyle('color: gray'); // Assumindo que o estilo muda para indicar desativado
        });
      
       
        
    });


    it('filters patterns by name', async () => {
        getPadroes.mockResolvedValue(mockPatternsData);

        render(<PatternList />);

        const search = screen.getByPlaceholderText("Pesquisar Padrão");
        fireEvent.change(search, {target: {value: "Epson"}});

        await waitFor(() => {
            expect(screen.getByText(/Epson.*456.*Inkjet/i)).toBeInTheDocument();
            expect(screen.queryByText(/HP.*123.*Laser/i)).toBeNull();
        });
    });
});
