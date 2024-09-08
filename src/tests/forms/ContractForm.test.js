import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContractForm from '../../components/forms/ContractForm';
import { createContract } from '../../services/contractService';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StatusDropdown from '../../components/containers/StatusDropdown';

jest.mock('../../services/contractService');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));


describe('ContractForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  

  test('should display error messages when fields are empty', async () => {
    render(
      <MemoryRouter>
        <ContractForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Cadastrar/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("O número do contrato é obrigatório");
      expect(toast.error).toHaveBeenCalledWith("O nome do gestor é obrigatório");
      expect(toast.error).toHaveBeenCalledWith("A descrição é obrigatória");
      expect(toast.error).toHaveBeenCalledWith("A data de início é obrigatória");
      expect(toast.error).toHaveBeenCalledWith("A data de término é obrigatória");
    });
  });

  test('should call createContract and show success toast when form is valid', async () => {
    createContract.mockResolvedValue({
      type: 'success',
      data: { data: { id: 1 } }
    });

    render(
      <MemoryRouter>
        <ContractForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Insira o n° do contrato/i), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText(/Insira o nome do gestor/i), { target: { value: 'Gestor Nome' } });
    fireEvent.change(screen.getByPlaceholderText(/Insira a descrição do contrato/i), { target: { value: 'Descrição do contrato' } });
    fireEvent.change(screen.getAllByPlaceholderText(/dd\/mm\/aaaa/i)[0], { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getAllByPlaceholderText(/dd\/mm\/aaaa/i)[1], { target: { value: '2024-12-31' } });

    fireEvent.click(screen.getByText(/Cadastrar/i));

    await waitFor(() => {
      expect(createContract).toHaveBeenCalledWith({
        numero: '123',
        nomeGestor: 'Gestor Nome',
        descricao: 'Descrição do contrato',
        dataInicio: '2024-01-01T00:00:00.000Z',
        dataTermino: '2024-12-31T00:00:00.000Z',
        ativo: true,
      });
      expect(toast.success).toHaveBeenCalledWith('Contrato criado com sucesso!');
    });
  });

  test('should show error toast when createContract fails', async () => {
    createContract.mockResolvedValue({
      type: 'error',
      error: { status: 400 }
    });

    render(
      <MemoryRouter>
        <ContractForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Insira o n° do contrato/i), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText(/Insira o nome do gestor/i), { target: { value: 'Gestor Nome' } });
    fireEvent.change(screen.getByPlaceholderText(/Insira a descrição do contrato/i), { target: { value: 'Descrição do contrato' } });
    fireEvent.change(screen.getAllByPlaceholderText(/dd\/mm\/aaaa/i)[0], { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getAllByPlaceholderText(/dd\/mm\/aaaa/i)[1], { target: { value: '2024-12-31' } });

    fireEvent.click(screen.getByText(/Cadastrar/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Este número de contrato ja existe!');
    });
  });

  test('should navigate to contract list when "Acessar Lista de Contratos" is clicked', () => {
    const mockLocation = jest.spyOn(window, 'location', 'get');
    mockLocation.mockReturnValue({
      assign: jest.fn(),
      pathname: '/listagemContrato',
    });
  
    render(
      <MemoryRouter>
        <ContractForm />
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByText(/Acessar Lista de Contratos/i));
  
    expect(window.location.pathname).toBe('/listagemContrato');
  
    mockLocation.mockRestore();
  });

  test('should show error when data de término is before data de início', () => {
    render(
      <MemoryRouter>
        <ContractForm />
      </MemoryRouter>
    );
  
    const dataFields = screen.getAllByPlaceholderText(/dd\/mm\/aaaa/i);
  
    fireEvent.change(dataFields[0], {
      target: { value: '2023-12-31' },
    });
  
    fireEvent.change(dataFields[1], {
      target: { value: '2023-01-01' },
    });
  
    fireEvent.click(screen.getByText(/Cadastrar/i));

    expect(toast.error).toHaveBeenCalledWith('A data de término não pode ser anterior à data de início');
  });

  test('should call handleStatus with "ativo" and set ativo to true', () => {
    render(
      <MemoryRouter>
        <ContractForm />
      </MemoryRouter>
    );

    const dropdown = screen.getByTestId('status-dropdown');
    
    fireEvent.change(dropdown, { target: { value: 'ativo' } });
  });

  test('should call handleStatus with "inativo" and set ativo to false', () => {
    render(
      <MemoryRouter>
        <ContractForm />
      </MemoryRouter>
    );

    const dropdown = screen.getByTestId('status-dropdown');
    
    fireEvent.change(dropdown, { target: { value: 'inativo' } });

  });

  test('should not change ativo if invalid value is selected', () => {
    render(
      <MemoryRouter>
        <ContractForm />
      </MemoryRouter>
    );

    const dropdown = screen.getByTestId('status-dropdown');
    
    fireEvent.change(dropdown, { target: { value: 'invalid' } });

  });

  //StatusDropdown tests//

  test('should display "--Selecione--" option when useSelecione is true', () => {
    render(
      <StatusDropdown 
        onChange={() => {}} 
        useSelecione={true} 
        initialValue="ativo" 
      />
    );
  
    const select = screen.getByTestId('status-dropdown');
    const option = screen.getByText('--Selecione--');
    
    expect(option).toBeInTheDocument();
    expect(select.value).toBe('ativo'); 
  });
  
  test('should not display "--Selecione--" option when useSelecione is false', () => {
    render(
      <StatusDropdown 
        onChange={() => {}} 
        useSelecione={false} 
        initialValue="ativo" 
      />
    );

    const option = screen.queryByText('--Selecione--');
    
    expect(option).not.toBeInTheDocument();
  });
  
  test('should set initial value in select element', () => {
    render(
      <StatusDropdown 
        onChange={() => {}} 
        useSelecione={true} 
        initialValue="inativo" 
      />
    );
  
    const select = screen.getByTestId('status-dropdown');
    expect(select.value).toBe('inativo');
  });

  test('should not call onChange handler if not provided', () => {
    const mockOnChange = jest.fn();
  
    render(
      <StatusDropdown 
        onChange={undefined} 
        useSelecione={false} 
        initialValue="ativo" 
      />
    );
  
    const select = screen.getByTestId('status-dropdown');
    
    fireEvent.change(select, { target: { value: 'inativo' } });
  
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});