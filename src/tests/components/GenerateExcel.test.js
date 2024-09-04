import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GenerateExcel from '../../components/GenerateExcel';
import { getPrinters } from '../../services/printerService';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

jest.mock("../../services/printerService");

jest.mock('react-toastify');

jest.mock('xlsx', () => ({
    utils: {
      json_to_sheet: jest.fn(),
      book_new: jest.fn(),
      book_append_sheet: jest.fn(),
      sheet_add_aoa: jest.fn(),
    },
    writeFile: jest.fn(),
}));

describe("GenerateExcel Component", () => {
    beforeEach(() => {
        getPrinters.mockResolvedValue({
            type: 'success',
            data: [
                {
                    id: 1,
                    numContrato: "123",
                    numSerie: "ABC",
                    enderecoIp: "192.168.0.1",
                    estaNaRede: true,
                    dataInstalacao: "2023-08-01T00:00:00.000Z",
                    dataRetirada: "2023-09-01T00:00:00.000Z",
                    dataContador: "2023-08-01T00:00:00.000Z",
                    ativo: true,
                    contadorInstalacaoPB: 100,
                    contadorInstalacaoCor: 200,
                    contadorAtualPB: 150,
                    contadorAtualCor: 250,
                    contadorRetiradaPB: 200,
                    contadorRetiradaCor: 300,
                    localizacao: "Goiânia",
                    modeloId: "2x24",
                },
            ],
        });
        toast.error = jest.fn();
        toast.success = jest.fn();
    });

    test("renders GenerateExcel component and button", async () => {
        render(<GenerateExcel />);
    
        // Verifica se o botão é renderizado
        expect(screen.getByText("Gerar Relatório Geral")).toBeInTheDocument();
    });

    test('should generate an Excel file when button is clicked', async () => {
    
        // Render the component
        render(<GenerateExcel />);
    
        // Wait for printers to be fetched
        await waitFor(() => expect(getPrinters).toHaveBeenCalledTimes(2));
    
        // Trigger the Excel generation by clicking the button
        fireEvent.click(screen.getByText('Gerar Relatório Geral'));
    
        // Check if XLSX functions were called correctly
        expect(XLSX.utils.json_to_sheet).toHaveBeenCalled();
        expect(XLSX.utils.book_new).toHaveBeenCalled();
        expect(XLSX.utils.book_append_sheet).toHaveBeenCalled();
        expect(XLSX.writeFile).toHaveBeenCalled();
    
        // Check if success toast was called
        expect(toast.success).toHaveBeenCalledWith('Relatório gerado com sucesso!');
    });

    test('should process printers data', async () => {
        render(<GenerateExcel />);
        
        await waitFor(() => expect(getPrinters).toHaveBeenCalled());

        expect(getPrinters).not.toHaveProperty('id');
        expect(getPrinters).not.toHaveProperty('enderecoIp');
        expect(getPrinters).not.toHaveProperty('modeloId');
    });
});
