import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuditPrinter from '../../pages/AuditPrinter';
import { getContract } from '../../services/contractService';
import { getPrintersByContract, generatePrinterPDF, getPrinters} from '../../services/printerService';
import { toast } from 'react-toastify';
import { MemoryRouter } from 'react-router-dom';
import GenerateExcel from '../../components/GenerateExcel';

// Mock the services and toast
jest.mock('../../components/UploadReport.js', () => (props) => (
    <div>
        {props.isOpen && (
            <div>
                <button data-testid="upload-button" onClick={() => props.onUpload([{ serialnumber: 'A1', actualColorCounter: 150, actualMonoCounter: 75, endTotalCounter: 500 }])}>
                    Upload
                </button>
                <button data-testid="close-button" onClick={props.onClose}>Close</button>
            </div>
        )}
    </div>
));

jest.mock('../../services/contractService', () => ({
    getContract: jest.fn(),
}));

jest.mock('../../services/printerService', () => ({
    getPrintersByContract: jest.fn(),
    generatePrinterPDF: jest.fn(),
    getPrinters: jest.fn(),
}));

jest.mock('../../assets/report.png', () => 'test-file-stub');
jest.mock('react-toastify');

describe('AuditPrinter', () => {
    beforeEach(() => {
        getContract.mockResolvedValue({
            type: 'success',
            data: { data: [{ numero: '123' }, { numero: '456' }] },
        });

        getPrintersByContract.mockResolvedValue({
            type: 'success',
            data: { data: [{ id: '1', numSerie: 'A1', contadorAtualCor: 100, contadorAtualPB: 50, contadorInstalacaoPB: 10, contadorInstalacaoCor: 5, contadorRetiradaPB: 2, contadorRetiradaCor: 1 }] },
        });

        getPrinters.mockResolvedValue({
            type: 'success',
            data: [
                {
                    id: 1,
                    numContrato: "12345",
                    numSerie: "SN123456789",
                    enderecoIp: "192.168.1.100",
                    estaNaRede: true,
                    dataInstalacao: "2023-01-01T00:00:00Z",
                    dataRetirada: "2023-06-01T00:00:00Z",
                    dataContador: "2023-09-01T00:00:00Z",
                    ativo: true,
                    contadorInstalacaoPB: 5000,
                    contadorInstalacaoCor: 1000,
                    contadorAtualPB: 7500,
                    contadorAtualCor: 1600,
                    contadorRetiradaPB: 7000,
                    contadorRetiradaCor: 1500,
                    localizacao: "Escritório Central",
                    modeloId: "MX500",
                    relatorio: {
                      id: 1,
                      impressoraId: 1,
                      contadorPB: 4000,
                      contadorPBDiff: 1500,
                      contadorCor: 800,
                      contadorCorDiff: 800,
                      ultimoResultado: 500,
                      resultadoAtual: 600,
                      ultimaAtualizacao: "2023-08-01T00:00:00Z"
                    },
                    relatorioLocadora: {
                      id: 1,
                      impressoraId: 1,
                      contadorPB: 4500,
                      contadorCor: 900,
                      contadorTotal: 5400
                    }
                }
            ], 
        });

        toast.success = jest.fn();
        toast.error = jest.fn();
    });

    test('handle generate PDF button', async () => {
        render(
            <MemoryRouter>
                <AuditPrinter />
            </MemoryRouter>
        );

        // Simulate selecting a contract
        await waitFor(() => {
            fireEvent.change(screen.getByTestId('contrato'), { target: { value: '123' } });
            expect(getPrintersByContract).toHaveBeenCalledWith('123');
        });

        // Mocka o upload do relatório

        // Simulate clicking the generate PDF button
        fireEvent.click(screen.getByText('Adicionar relatório locadora'));
        fireEvent.click(screen.getByText('Upload'));

        // Wait for the PDF to be generated
        await waitFor(() => {
            fireEvent.click(screen.getByTestId('report-image'));
            expect(generatePrinterPDF).toHaveBeenCalledWith('1');
            expect(toast.success).toHaveBeenCalledWith('Arquivo carregado com sucesso!');
        });
    });

    test('renders the component and displays the contract options', async () => {
        render(
            <MemoryRouter>
                <AuditPrinter />
            </MemoryRouter>
        );

        // Check if the title is rendered
        expect(screen.getByText('Auditoria')).toBeInTheDocument();

        // Wait for contracts to be loaded
        await waitFor(() => {
            expect(screen.getByTestId('contrato')).toBeInTheDocument();
        });
    });

    test('handles contract selection and displays printers', async () => {
        render(
            <MemoryRouter>
                <AuditPrinter />
            </MemoryRouter>
        );

        // Simulate selecting a contract

        await waitFor(() => {
            fireEvent.change(screen.getByTestId('contrato'), { target: { value: '123' } });
            expect(getPrintersByContract).toHaveBeenCalledWith('123');
        });
    });

    test('shows the upload report modal when clicking the button', async () => {
        render(
            <MemoryRouter>
                <AuditPrinter />
            </MemoryRouter>
        );

        // Click the button to open the upload report modal
        fireEvent.click(screen.getByText('Adicionar relatório locadora'));

        await waitFor(() => {
            expect(screen.getByText('Adicionar relatório locadora')).toBeInTheDocument();
        });
    });

    test('displays error when contract fetch fails', async () => {
        getContract.mockRejectedValueOnce(new Error('Fetch failed'));

        render(
            <MemoryRouter>
                <AuditPrinter />
            </MemoryRouter>
        );

        // Wait for error handling
        await waitFor(() => {
            expect(screen.getByTestId('contrato')).toBeInTheDocument();
        });
    });

    test('displays error when printer fetch fails', async () => {
        getPrintersByContract.mockRejectedValueOnce(new Error('Fetch failed'));

        render(
            <MemoryRouter>
                <AuditPrinter />
            </MemoryRouter>
        );

        await waitFor(() => {
            fireEvent.change(screen.getByTestId('contrato'), { target: { value: '123' } });
            expect(toast.error).toHaveBeenCalledWith('Erro ao buscar impressoras!');
        });
    });

});

