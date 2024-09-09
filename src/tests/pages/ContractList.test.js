import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContractList from '../../pages/ContractList';
import { getContract } from '../../services/contractService';
import { toast } from 'react-toastify';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../services/contractService');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockContracts = [
  {
    id: 1,
    numero: '001',
    nomeGestor: 'John Doe',
    dataInicio: '2022-01-01',
    dataTermino: '2023-01-01',
    ativo: true,
  },
  {
    id: 2,
    numero: '002',
    nomeGestor: 'Jane Smith',
    dataInicio: '2021-01-01',
    dataTermino: '2022-01-01',
    ativo: false,
  },
];

describe('ContractList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch and display contracts', async () => {
    getContract.mockResolvedValue({
      type: 'success',
      data: { data: mockContracts },
    });

    render(
      <MemoryRouter>
        <ContractList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('001')).toBeInTheDocument();
      expect(screen.getByText('002')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('should display error toast when fetching contracts fails', async () => {
    getContract.mockResolvedValue({
      type: 'error',
    });

    render(
      <MemoryRouter>
        <ContractList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao obter os contratos');
    });
  });

  test('should navigate to create contract form when "Cadastrar Novo Contrato" is clicked', () => {
    const mockLocation = jest.spyOn(window, 'location', 'get');
    mockLocation.mockReturnValue({
      assign: jest.fn(),
      pathname: '/cadastrarContrato',
    });

    render(
      <MemoryRouter>
        <ContractList />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Cadastrar Novo Contrato/i));

    expect(window.location.pathname).toBe('/cadastrarContrato');
    
    mockLocation.mockRestore();
  });
  
  //ContractBox//

});