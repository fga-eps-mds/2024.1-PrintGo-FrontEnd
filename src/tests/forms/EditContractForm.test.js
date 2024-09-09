import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import EditContractForm from '../../components/forms/EditContractForm'
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { editContract } from '../../services/contractService';
import StatusDropdown from '../../components/containers/StatusDropdown';

jest.mock('react-toastify', () => ({
    toast: {
      success: jest.fn(),
      error: jest.fn(),
    },
}));
  
jest.mock('../../services/contractService', () => ({
    editContract: jest.fn(),
}));

const mockContract = {
  id: 1,
  numero: '12345',
  nomeGestor: 'João',
  descricao: 'Contrato de teste',
  dataInicio: '2023-01-01',
  dataTermino: '2024-01-01',
  ativo: true,
};

describe('EditContractForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <MemoryRouter initialEntries={[{ state: { contract: mockContract } }]}>
        <EditContractForm />
      </MemoryRouter>
    );
  });

  test('renders the form with initial values', () => {
    expect(screen.getByDisplayValue('12345')).toBeInTheDocument();
    expect(screen.getByDisplayValue('João')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Contrato de teste')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2023-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument();
    
    // Verifica se a opção "Ativo" está selecionada no dropdown de status
    const statusDropdown = screen.getByTestId('status-dropdown');
    expect(statusDropdown).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ativo' }).selected).toBe(true);
  });

  test('displays error when required fields are missing', async () => {
    fireEvent.change(screen.getByLabelText('Contrato'), { target: { value: '' } });
    fireEvent.click(screen.getByText('Salvar Mudanças'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('O número do contrato é obrigatório');
    });
  });

  test('displays error when data de término is earlier than data de início', async () => {
    fireEvent.change(screen.getByLabelText('Data de Término'), { target: { value: '2022-01-01' } });
    fireEvent.click(screen.getByText('Salvar Mudanças'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('A data de término não pode ser anterior à data de início');
    });
  });

  test('calls editContract service on valid form submission', async () => {
    editContract.mockResolvedValue({
        type: 'success',
        data: { data: { id: 1 } }
      });
    // Simular a alteração dos valores do formulário
    fireEvent.change(screen.getByLabelText('Contrato'), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText('Gestor do Contrato'), { target: { value: 'João' } });
    fireEvent.change(screen.getByLabelText('Descrição do Contrato (Processo)'), { target: { value: 'Contrato de teste' } });
    fireEvent.change(screen.getByLabelText('Data de Início'), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText('Data de Término'), { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getByTestId('status-dropdown'), { target: { value: 'inativo' } });
  
    // Capturar o botão de salvar e simular o clique
    fireEvent.click(screen.getByText(/Salvar Mudanças/i));
  
    // Esperar que a função editContract seja chamada com os valores esperados
    await waitFor(() => {
      expect(editContract).toHaveBeenCalledWith(1, {
        numero: '12345',
        nomeGestor: 'João',
        descricao: 'Contrato de teste',
        dataInicio: '2023-01-01T00:00:00.000Z',
        dataTermino: '2024-01-01T00:00:00.000Z',
        ativo: false,
      });
      expect(toast.success).toHaveBeenCalledWith('Contrato editado com sucesso!');
    });
  });

  test('displays error if trying to activate a contract with an expired date', async () => {
    fireEvent.change(screen.getByLabelText('Contrato'), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText('Gestor do Contrato'), { target: { value: 'Lucas' } });
    fireEvent.change(screen.getByLabelText('Descrição do Contrato (Processo)'), { target: { value: 'Contrato' } });
    fireEvent.change(screen.getByLabelText('Data de Término'), { target: { value: '2020-01-01' } });
    fireEvent.click(screen.getByText('Salvar Mudanças'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('A data de término não pode ser anterior à data de início');
    });
  });

  test('displays error when nomeGestor is missing', async () => {
    // Simula a exclusão do nome do gestor
    fireEvent.change(screen.getByLabelText('Gestor do Contrato'), { target: { value: '' } });
    fireEvent.click(screen.getByText('Salvar Mudanças'));
  
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('O nome do gestor é obrigatório');
    });
  });
  
  test('displays error when descricao is missing', async () => {
    // Simula a exclusão da descrição
    fireEvent.change(screen.getByLabelText('Descrição do Contrato (Processo)'), { target: { value: '' } });
    fireEvent.click(screen.getByText('Salvar Mudanças'));
  
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('A descrição é obrigatória');
    });
  });
  
  test('displays error when dataInicio is missing', async () => {
    // Simula a exclusão da data de início
    fireEvent.change(screen.getByLabelText('Data de Início'), { target: { value: '' } });
    fireEvent.click(screen.getByText('Salvar Mudanças'));
  
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('A data de início é obrigatória');
    });
  });
  
  test('displays error when dataTermino is missing', async () => {
    // Simula a exclusão da data de término
    fireEvent.change(screen.getByLabelText('Data de Término'), { target: { value: '' } });
    fireEvent.click(screen.getByText('Salvar Mudanças'));
  
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('A data de término é obrigatória');
    });
  });

  test('sets ativo to true when "ativo" is selected from the status dropdown', () => {
    const statusDropdown = screen.getByTestId('status-dropdown');
  
    // Simular a mudança no dropdown para "ativo"
    fireEvent.change(statusDropdown, { target: { value: 'ativo' } });
  
    // Verificar se o estado foi alterado para true
    expect(statusDropdown.value).toBe('ativo');
  });

  test('navigates to /listagemContrato when navigateToContractList is called', () => {
    const mockLocation = jest.spyOn(window, 'location', 'get');
    mockLocation.mockReturnValue({
      assign: jest.fn(),
      pathname: '/listagemContrato',
    });
  
    fireEvent.click(screen.getByText(/Cancelar/i));

    expect(window.location.pathname).toBe('/listagemContrato');
  
    mockLocation.mockRestore();
  });

  test('displays error when trying to activate a contract with an expired date', async () => {
    // Preenche os campos obrigatórios corretamente para passar pelas validações anteriores
    fireEvent.change(screen.getByLabelText('Contrato'), { target: { value: '345' } });
    fireEvent.change(screen.getByLabelText('Gestor do Contrato'), { target: { value: 'Jão' } });
    fireEvent.change(screen.getByLabelText('Descrição do Contrato (Processo)'), { target: { value: 'teste' } });
    fireEvent.change(screen.getByLabelText('Data de Início'), { target: { value: '2023-01-02' } });
  
    // Simula a data de término sendo no passado
    fireEvent.change(screen.getByLabelText('Data de Término'), { target: { value: '2024-01-01' } });
  
    // Simula a mudança no status do contrato para "ativo"
    fireEvent.change(screen.getByTestId('status-dropdown'), { target: { value: 'ativo' } });
  
    // Simula o clique no botão de salvar, que dispara handleSubmit
    fireEvent.click(screen.getByText(/Salvar Mudanças/i));
  
    // Verifica se o toast.error foi chamado com a mensagem de contrato expirado
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Você esta ativando um contrato com a data vencida!');
    });
  });
});