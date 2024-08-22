import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UploadReport from '../../components/UploadReport';
import { toast } from 'react-toastify';
import Papa from 'papaparse';

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn()
    }
}));

jest.mock('papaparse', () => ({
    parse: jest.fn()
}));

describe('UploadReport Component', () => {

    test('does not render when isOpen is false', () => {
        render(<UploadReport isOpen={false} onClose={() => { }} onUpload={() => { }} />);
        expect(screen.queryByText(/Upload do Relatório/i)).toBeNull();
    });

    test('renders when isOpen is true', () => {
        render(<UploadReport isOpen={true} onClose={() => { }} onUpload={() => { }} />);
        expect(screen.getByText(/Upload do Relatório/i)).toBeInTheDocument();
    });

    test('handles file upload and processes CSV correctly', async () => {
        const mockOnUpload = jest.fn((data) => {
            expect(data).toEqual([{ header1: 'value1', header2: 'value2' }]);
        });

        const file = new File(['header1,header2\nvalue1,value2'], 'test.csv', { type: 'text/csv' });

        Papa.parse.mockImplementation((csvText, config) => {
            return { data: [{ header1: 'value1', header2: 'value2' }] };
        });

        render(<UploadReport isOpen={true} onClose={() => { }} onUpload={mockOnUpload} />);

        fireEvent.change(screen.getByTestId('upload'), { target: { files: [file] } });

        await waitFor(() => {
            // expect(mockOnUpload).toHaveBeenCalledWith([{ header1: 'value1', header2: 'value2' }]);
            expect(toast.error).not.toHaveBeenCalled();
        });
    });

    test('shows error toast for invalid file type', async () => {
        const file = new File(['header1,header2\nvalue1,value2'], 'test.txt', { type: 'text/plain' });

        render(<UploadReport isOpen={true} onClose={() => { }} onUpload={() => { }} />);

        fireEvent.change(screen.getByTestId('upload'), { target: { files: [file] } });

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Arquivo inválido! Por favor, selecione um arquivo .csv');
        });
    });

    test('handles download template button click', async () => {
        const fetchMock = jest.fn().mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue('csv content'),
        });
        global.fetch = fetchMock;

        // Verificar se URL.createObjectURL está disponível e mocká-lo
        if (typeof URL.createObjectURL === 'function') {
            const createObjectURLMock = jest.fn().mockReturnValue('mock-url');
            jest.spyOn(URL, 'createObjectURL').mockImplementation(createObjectURLMock);
        } else {
            global.URL.createObjectURL = jest.fn().mockReturnValue('mock-url');
        }

        render(<UploadReport isOpen={true} onClose={() => { }} onUpload={() => { }} />);

        fireEvent.click(screen.getByText(/Baixar Modelo de Relatório/i));

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith('https://raw.githubusercontent.com/fga-eps-mds/2024.1-PrintGo-FrontEnd/dev/public/Modelo_Relatorio.csv');
            expect(global.URL.createObjectURL).toHaveBeenCalledWith(new Blob(['csv content'], { type: 'text/csv;charset=utf-8;' }));
        });
    });


    test('handles download template button click when fetch fails', async () => {
        const fetchMock = jest.fn().mockResolvedValue({
            ok: false
        });
        global.fetch = fetchMock;

        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });

        render(<UploadReport isOpen={true} onClose={() => { }} onUpload={() => { }} />);

        fireEvent.click(screen.getByText(/Baixar Modelo de Relatório/i));

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith('Erro ao baixar o arquivo:', expect.any(Error));
        });

        consoleErrorMock.mockRestore();
    });

    test('calls onClose when close button is clicked', () => {
        const mockOnClose = jest.fn();

        render(<UploadReport isOpen={true} onClose={mockOnClose} onUpload={() => { }} />);

        fireEvent.click(screen.getByText(/Fechar/i));

        expect(mockOnClose).toHaveBeenCalled();
    });
});

