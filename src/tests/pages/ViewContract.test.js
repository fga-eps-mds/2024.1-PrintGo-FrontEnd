import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ViewContract from '../../pages/ViewContract';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getContractById } from '../../services/contractService';

jest.mock('../../services/contractService');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockContract = {
  id: 2,
  numero: '007',
  nomeGestor: 'James',
  descricao: 'Contrato Royal',
  dataInicio: '2020-01-01',
  dataTermino: '2024-04-04',
  ativo: true,
};

describe('ViewContract', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  test('should show an error if fetching contract fails', async () => {
    getContractById.mockRejectedValue(new Error('Erro ao buscar o contrato'));

    render(
      <MemoryRouter initialEntries={['/viewContrato/2']}>
        <Routes>
          <Route path="/viewContrato/:id" element={<ViewContract />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao buscar o contrato');
    });
  });

  test('should navigate to the edit contract page on clicking Edit button', async () => {
    getContractById.mockResolvedValue({
      type: 'success',
      data: mockContract,
    });

    render(
      <MemoryRouter initialEntries={['/viewContrato/2']}>
        <Routes>
          <Route path="/viewContrato/:id" element={<ViewContract />} />
          <Route path="/editarContrato" element={<div>Edit Contract Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('007')).toBeInTheDocument();
    });

    const editButton = screen.getByText('Editar');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText('Edit Contract Page')).toBeInTheDocument();
    });
  });

  test('navigates to /listagemContrato on clicking Back button', () => {
    const mockLocation = jest.spyOn(window, 'location', 'get');
    mockLocation.mockReturnValue({
      assign: jest.fn(),
      pathname: '/listagemContrato',
    });

    render(
        <MemoryRouter initialEntries={['/viewContrato/2']}>
          <Routes>
            <Route path="/viewContrato/:id" element={<ViewContract />} />
          </Routes>
        </MemoryRouter>
      );
  
    fireEvent.click(screen.getByText(/Voltar/i));

    expect(window.location.pathname).toBe('/listagemContrato');
  
    mockLocation.mockRestore();
  });

  test('should show an error if contract fetch does not succeed', async () => {
    getContractById.mockResolvedValue({
      type: 'error',
    });
  
    render(
      <MemoryRouter initialEntries={['/viewContrato/2']}>
        <Routes>
          <Route path="/viewContrato/:id" element={<ViewContract />} />
        </Routes>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao obter o contrato');
    });
  });
});