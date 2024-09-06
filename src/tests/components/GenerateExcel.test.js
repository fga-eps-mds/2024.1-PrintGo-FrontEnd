import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GenerateExcel, { handleGenerateExcel, generateExcelFile } from '../../components/GenerateExcel';
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
        toast.error = jest.fn();
        toast.success = jest.fn();
    });

    test("should call handleGenerateExcel correctly", () => {
        const mockPrinters = [
            {
                numContrato: "123",
                numSerie: "ABC",
                estaNaRede: true,
                dataInstalacao: "2023-01-10T00:00:00Z",
                dataRetirada: "2023-06-10T00:00:00Z",
                dataContador: "2023-09-10T00:00:00Z",
                ativo: true,
                contadorInstalacaoPB: 100,
                contadorInstalacaoCor: 200,
                contadorAtualPB: 150,
                contadorAtualCor: 250,
                contadorRetiradaPB: 200,
                contadorRetiradaCor: 300,
                localizacao: "Goiânia",
                relatorio: {
                  contadorPB: 50,
                  contadorCor: 100,
                },
            },
        ];

        const formatted = handleGenerateExcel(mockPrinters);

        expect(formatted).toEqual([
          {
            contrato: "123",
            numeroSerie: "ABC",
            estaNaRede: "Sim",
            dataInstalacao: "1/10/2023",
            dataRetirada: "6/10/2023",
            dataContador: "9/10/2023",
            ativo: "Sim",
            contadorInstalacaoPB: 100,
            contadorRetiradaPB: 200,
            contadorInstalacaoCL: 200,
            contadorRetiradaCL: 300,
            contadorPBAnterior: 50,
            contadorPBAtual: 150,
            contadorCLAnterior: 100,
            contadorCLAtual: 250,
            totPrintgoPB: 100,
            totPrintgoCL: 150,
            localizacao: "Goiânia",
          }
        ]);
    });

    test("should call handleGenerateExcel corretly with other options", () => {
        const mockPrinters = [
            {
                numContrato: "123",
                numSerie: "ABC",
                estaNaRede: false,
                ativo: false,
                contadorInstalacaoPB: 100,
                contadorInstalacaoCor: 200,
                contadorAtualPB: 150,
                contadorAtualCor: 250,
                contadorRetiradaPB: 200,
                contadorRetiradaCor: 300,
                localizacao: "Goiânia",
            },
        ];

        const formatted = handleGenerateExcel(mockPrinters);

        expect(formatted).toEqual([
          {
            contrato: "123",
            numeroSerie: "ABC",
            estaNaRede: "Não",
            dataInstalacao: "N/A",
            dataRetirada: "N/A",
            dataContador: "N/A",
            ativo: "Não",
            contadorInstalacaoPB: 100,
            contadorRetiradaPB: 200,
            contadorInstalacaoCL: 200,
            contadorRetiradaCL: 300,
            contadorPBAnterior: 0,
            contadorPBAtual: 150,
            contadorCLAnterior: 0,
            contadorCLAtual: 250,
            totPrintgoPB: 0,
            totPrintgoCL: 0,
            localizacao: "Goiânia",
          }
        ]);
    });

    test("renders GenerateExcel component and button", async () => {
        render(<GenerateExcel />);
    
        // Verifica se o botão é renderizado
        expect(screen.getByText("Gerar Relatório Geral")).toBeInTheDocument();
    });

    test('should generate Excel correctly', async () => {
        render(<GenerateExcel/>);
        await waitFor(() => expect(screen.getByText('Gerar Relatório Geral')).toBeInTheDocument());
        fireEvent.click(screen.getByText('Gerar Relatório Geral'));
        await waitFor(() => {
            expect(XLSX.utils.json_to_sheet).toHaveBeenCalled();
            expect(XLSX.utils.book_new).toHaveBeenCalled();
            expect(XLSX.utils.book_append_sheet).toHaveBeenCalled();
            expect(XLSX.writeFile).toHaveBeenCalled();
          });
        expect(toast.success).toHaveBeenCalledWith('Relatório gerado com sucesso!');
    });

    test('should throw error mesage', async () => {
        // Simula um erro na função XLSX.writeFile
        XLSX.writeFile.mockImplementation(() => {
          throw new Error('Erro ao gerar Excel');
        });
    
        render(<GenerateExcel />); // Renderiza o componente
        
        // Aguarda os dados serem carregados
        await waitFor(() => expect(screen.getByText('Gerar Relatório Geral')).toBeInTheDocument());
    
        // Simula o clique no botão para gerar o relatório
        fireEvent.click(screen.getByText('Gerar Relatório Geral'));
    
        // Verifica se o toast de erro foi chamado
        await waitFor(() => {
          expect(toast.error).toHaveBeenCalledWith('Falha ao gerar relatório excel');
        });
      });
});
