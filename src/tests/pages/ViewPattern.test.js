import React from 'react';
import { render as rtlRender, screen, within } from '@testing-library/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ViewPattern from '../../pages/ViewPattern';
import * as router from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn(),
    useLocation: jest.fn(),
}));

function render(ui, { route = '/', ...renderOptions } = {}) {
    window.history.pushState({}, 'Test page', route);

    function Wrapper({ children }) {
        return <Router>{children}</Router>;
    }

    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

describe('ViewPrinter', () => {

    beforeEach(() => {
        router.useNavigate.mockImplementation(jest.requireActual('react-router-dom').useNavigate);
        jest.clearAllMocks();
    });

    it('renders with pattern data', () => {
        const patternData = {
            id: '1',
            marca: 'HP',
            modelo: 'LaserJet',
            tipo: 'Laser',
            colorido: true,
            oidModelo: '1.2.3.4',
            oidNumeroSerie: '1.2.3.5',
            oidFirmware: '1.2.3.6',
            oidTempoAtivo: '1.2.3.7',
            oidDigitalizacoes: '1.2.3.8',
            oidCopiasPB: '1.2.3.9',
            oidCopiasCor: '1.2.3.10',
            oidTotalGeral: '1.2.3.11',
            ativo: true,
        };

        router.useLocation.mockReturnValue({ state: patternData });

        render(<ViewPattern />);

        expect(screen.getByText('Voltar')).toBeInTheDocument();

        const tipoElement = screen.getByTestId("tipo");
        const modeloElement = screen.getByTestId("modelo");
        const marcaElement = screen.getByTestId("marca");
        const coloridoElement = screen.getByTestId("colorido");
        const ativoElement = screen.getByTestId("ativo");
        const oidModeloElement = screen.getByTestId("oidModelo");
        const oidNumeroSerieElement = screen.getByTestId("oidNumeroSerie");
        const oidFirmwareElement = screen.getByTestId("oidFirmware");
        const oidTempoAtivoElement = screen.getByTestId("oidTempoAtivo");
        const oidDigitalizacoesElement = screen.getByTestId("oidDigitalizacoes");
        const oidCopiasPBElement = screen.getByTestId("oidCopiasPB");
        const oidCopiasCorElement = screen.getByTestId("oidCopiasCor");
        const oidTotalGeralElement = screen.getByTestId("oidTotalGeral");

        expect(tipoElement).toHaveTextContent('Laser');
        expect(modeloElement).toHaveTextContent('LaserJet');
        expect(marcaElement).toHaveTextContent('HP');
        expect(coloridoElement).toHaveTextContent("Sim");
        expect(ativoElement).toHaveTextContent("Sim");
        expect(oidModeloElement).toHaveTextContent('1.2.3.4');
        expect(oidNumeroSerieElement).toHaveTextContent('1.2.3.5');
        expect(oidFirmwareElement).toHaveTextContent('1.2.3.6');
        expect(oidTempoAtivoElement).toHaveTextContent('1.2.3.7');
        expect(oidDigitalizacoesElement).toHaveTextContent('1.2.3.8');
        expect(oidCopiasPBElement).toHaveTextContent('1.2.3.9');
        expect(oidCopiasCorElement).toHaveTextContent('1.2.3.10');
        expect(oidTotalGeralElement).toHaveTextContent('1.2.3.11');
    });

    it('renders with default data when no data is provided', () => {
        router.useLocation.mockReturnValue({ state: null });

        render(<ViewPattern />);

        expect(screen.getByText('Voltar')).toBeInTheDocument();

        const tipoElement = screen.getByTestId("tipo");
        const modeloElement = screen.getByTestId("modelo");
        const marcaElement = screen.getByTestId("marca");
        const coloridoElement = screen.getByTestId("colorido");
        const ativoElement = screen.getByTestId("ativo");
        const oidModeloElement = screen.getByTestId("oidModelo");
        const oidNumeroSerieElement = screen.getByTestId("oidNumeroSerie");
        const oidFirmwareElement = screen.getByTestId("oidFirmware");
        const oidTempoAtivoElement = screen.getByTestId("oidTempoAtivo");
        const oidDigitalizacoesElement = screen.getByTestId("oidDigitalizacoes");
        const oidCopiasPBElement = screen.getByTestId("oidCopiasPB");
        const oidCopiasCorElement = screen.getByTestId("oidCopiasCor");
        const oidTotalGeralElement = screen.getByTestId("oidTotalGeral");

        expect(tipoElement).toHaveTextContent('');
        expect(modeloElement).toHaveTextContent('');
        expect(marcaElement).toHaveTextContent('');
        expect(coloridoElement).toHaveTextContent('Não');
        expect(ativoElement).toHaveTextContent('Não');
        expect(oidModeloElement).toHaveTextContent('');
        expect(oidNumeroSerieElement).toHaveTextContent('');
        expect(oidFirmwareElement).toHaveTextContent('');
        expect(oidTempoAtivoElement).toHaveTextContent('');
        expect(oidDigitalizacoesElement).toHaveTextContent('');
        expect(oidCopiasPBElement).toHaveTextContent('');
        expect(oidCopiasCorElement).toHaveTextContent('');
        expect(oidTotalGeralElement).toHaveTextContent('');
    });
});
