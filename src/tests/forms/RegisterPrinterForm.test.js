import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RegisterPrinterForm from '../../components/forms/RegisterPrinterForm';
import { createImpressora, getLocalizacao } from '../../services/printerService';
import { getPadroes } from '../../services/patternService';
import { getContract } from '../../services/contractService';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

jest.mock('../../services/printerService');
jest.mock('../../services/patternService');
jest.mock('../../services/contractService');
jest.mock('react-toastify');

describe('RegisterPrinterForm', () => {
    beforeEach(() => {
        getLocalizacao.mockResolvedValue({
            data: [{ name: 'City 1', workstations: [{ name: 'WS 1', child_workstations: [{ name: 'SW 1' }] }] }],
        });

        getPadroes.mockResolvedValue({
            data: [{ marca: 'Marca 1', modelo: 'Modelo 1' }],
        });

        getContract.mockResolvedValue({
            type: 'success',
            data: { data: [{ numero: '123' }, { numero: '2' }] },
        });

        toast.error = jest.fn();
    });

    test('renders the form correctly', async () => {
        render(
            <MemoryRouter>
                <RegisterPrinterForm />
            </MemoryRouter>
        );

        expect(screen.getByText('Cadastrar Equipamento')).toBeInTheDocument();
    });

    test('applies error class to select element when there is a validation error', async () => {
        render(
            <MemoryRouter>
                <RegisterPrinterForm />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Cadastrar'));

        await waitFor(() => {
            const contratoSelect = screen.getByTestId('contrato');
            expect(contratoSelect).toHaveClass('input-error');
        });
    });

    test('submits the form successfully', async () => {
        createImpressora.mockResolvedValue({ type: 'success' });

        const screen = render(
            <MemoryRouter>
                <RegisterPrinterForm />
            </MemoryRouter>
        );

        const contractInput = screen.getByTestId('contrato');
        const newMarca = screen.getByTestId('marca');
        const enderecoIP = screen.getByLabelText('Endereço IP');
        const serialNumberInput = screen.getByPlaceholderText('Insira número de série');
        const cityInput = screen.getByTestId('cidade');
        const workstationElement = screen.getByTestId('workstation');
        const subWorkstation = screen.getByTestId('subworkstation');
        const installationDateContainer = screen.getByTestId('date-container-Data de Instalação');
        const blackAndWhiteCounter = screen.getByLabelText('Contador preto e branco');
        const colorCounterInput = screen.getByLabelText('Contador com cor');

        fireEvent.change(enderecoIP, { target: { value: '111.111.1.1' } });
        fireEvent.change(serialNumberInput, { target: { value: 'XYZ123' } });
        fireEvent.change(installationDateContainer, { target: { value: '2024-08-11' } });
        fireEvent.change(blackAndWhiteCounter, { target: { value: '100' } });
        fireEvent.change(colorCounterInput, { target: { value: '50' } });

        // fireEvent.change(screen.getByLabelText('Modelo'), { target: { value: 'Modelo 1' } });

        await waitFor(() => {
            fireEvent.change(contractInput, { target: { value: '123' } });
            fireEvent.change(newMarca, { target: { value: 'Marca 1' } });
            fireEvent.change(cityInput, { target: { value: 'City 1' } });
            fireEvent.change(workstationElement, { target: { value: 'WS 1' } });
            fireEvent.change(subWorkstation, { target: { value: 'SW 1' } });

            expect(contractInput).toHaveValue('123');
            expect(newMarca).toHaveValue('Marca 1');
            expect(enderecoIP).toHaveValue('111.111.1.1');
            expect(serialNumberInput).toHaveValue('XYZ123');
            expect(cityInput).toHaveValue('City 1');
            expect(workstationElement).toHaveValue('WS 1');
            expect(subWorkstation).toHaveValue('SW 1');
            expect(installationDateContainer).toHaveValue('2024-08-11');
            expect(blackAndWhiteCounter).toHaveValue(100);
            expect(colorCounterInput).toHaveValue(50);
            fireEvent.click(screen.getByText('Cadastrar'));

            expect(createImpressora).toHaveBeenCalledTimes(1);
            expect(toast.error).not.toHaveBeenCalled();
        });
    });
});
