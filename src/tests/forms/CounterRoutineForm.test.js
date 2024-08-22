import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UpdateRoutine from '../../components/forms/CounterRoutineForm';
import { getLocalizacao, addRotina } from '../../services/printerService';
import { MemoryRouter } from "react-router-dom";
import { toast } from 'react-toastify';

jest.mock('../../services/printerService');
jest.mock('react-toastify');


describe('UpdateRoutine', () => {
  beforeEach(() => {
    getLocalizacao.mockResolvedValue({
      data: [
        { name: 'City 1', workstations: [{ name: 'WS 1', child_workstations: [{ name: 'SW 1' }] }] },
        { name: 'City 2', workstations: [{ name: 'WS 2', child_workstations: [{ name: 'SW 2' }] }] }
      ],
    });
    toast.error = jest.fn();
    toast.success = jest.fn();
  });

  test('renders the form correctly', async () => {
    render(
      <MemoryRouter>
        <UpdateRoutine />
      </MemoryRouter>
    );

    expect(screen.getByText('Rotina de Registro Automático')).toBeInTheDocument();
  });

  test('renders the form with all inputs', () => {
    render(
      <MemoryRouter>
        <UpdateRoutine />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Cidade')).toBeInTheDocument();
    expect(screen.getByLabelText('Regional')).toBeInTheDocument();
    expect(screen.getByLabelText('Unidade de Trabalho')).toBeInTheDocument();
    expect(screen.getByLabelText('Rotina de Registro')).toBeInTheDocument();
  });

  test('submits the form without errors when all fields are valid', async () => {
    addRotina.mockResolvedValue({ type: 'success' });

    render(
      <MemoryRouter>
        <UpdateRoutine />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'City 1' } });
    fireEvent.change(screen.getByLabelText('Regional'), { target: { value: 'WS 1' } });
    fireEvent.change(screen.getByLabelText('Unidade de Trabalho'), { target: { value: 'SW 1' } });
    fireEvent.change(screen.getByLabelText('Rotina de Registro'), { target: { value: 'Diariamente' } });
    fireEvent.change(screen.getByLabelText('Escolha um horário:'), { target: { value: '12:00' } });

    fireEvent.click(screen.getByText('Adicionar Rotina'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Rotina registrada com sucesso!');
    });
  });

  test('displays an error toast when form submission fails', async () => {
    addRotina.mockResolvedValue({ type: 'error', error: 'Error message' });

    render(
      <MemoryRouter>
        <UpdateRoutine />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'City 1' } });
    fireEvent.change(screen.getByLabelText('Regional'), { target: { value: 'WS 1' } });
    fireEvent.change(screen.getByLabelText('Unidade de Trabalho'), { target: { value: 'SW 1' } });
    fireEvent.change(screen.getByLabelText('Rotina de Registro'), { target: { value: 'Diariamente' } });
    fireEvent.change(screen.getByLabelText('Escolha um horário:'), { target: { value: '12:00' } });

    fireEvent.click(screen.getByText('Adicionar Rotina'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao registrar rotina: Error message');
    });
  });
});