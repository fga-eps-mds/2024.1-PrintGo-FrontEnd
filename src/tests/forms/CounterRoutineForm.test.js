import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import UpdateRoutine from '../../components/forms/CounterRoutineForm';
import { getLocalizacao, addRotina } from '../../services/printerService';
import { MemoryRouter, useNavigate} from "react-router-dom";
import { toast } from 'react-toastify';

jest.mock('../../services/printerService');
jest.mock('react-toastify');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

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
    const mockNavigate = jest.fn();
    addRotina.mockResolvedValue({ type: 'success' });
    useNavigate.mockReturnValue(mockNavigate);

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
      expect(toast.error).not.toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 4000 });
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

  test('displays an error toast when fetching localizations fails', async () => {
    getLocalizacao.mockResolvedValue({ type: 'error' });
  
    render(
      <MemoryRouter>
        <UpdateRoutine />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao buscar localizações!');
    });
  });

  test('logs an error to the console when fetching localizations throws an exception', async () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    getLocalizacao.mockRejectedValue(new Error('Network error'));
  
    render(
      <MemoryRouter>
        <UpdateRoutine />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith(
        "Erro ao buscar localizações:",
        expect.any(Error)
      );
    });
  
    consoleErrorMock.mockRestore();
  });

  test('should not render routine options when an invalid selection is made', () => {
    render(
      <MemoryRouter>
        <UpdateRoutine />
      </MemoryRouter>
    );

    const selectElement = screen.getByLabelText('Rotina de Registro');
    fireEvent.change(selectElement, { target: { value: '' } });

    expect(screen.queryByText('Escolha um horário:')).not.toBeInTheDocument();
    expect(screen.queryByText('Escolha o intervalo:')).not.toBeInTheDocument();
  });

  test('should add and remove selectedDay class when day buttons are clicked', () => {
    render(
      <MemoryRouter>
        <UpdateRoutine />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Rotina de Registro'), {
      target: { value: 'Semanalmente' },
    });

    const sundayButton = screen.getByText('D');
    const tuesdayButton = screen.getByText('T');

    fireEvent.click(sundayButton);
    expect(sundayButton).toHaveClass('selectedDay');

    expect(screen.queryByText('Escolha o dia:')).not.toHaveClass('errorRoutine-message');

    fireEvent.click(sundayButton);
    expect(sundayButton).not.toHaveClass('selectedDay');

    expect(screen.queryByText('Escolha o dia:')).not.toHaveClass('errorRoutine-message');

    fireEvent.click(tuesdayButton);
    expect(tuesdayButton).toHaveClass('selectedDay');
  });

  test('should handle interval change correctly', () => {
    render(
      <MemoryRouter>
        <UpdateRoutine />
      </MemoryRouter>
    );
    
    const selectElement = screen.getByLabelText('Rotina de Registro');
    fireEvent.change(selectElement, { target: { value: 'Diariamente' } });

    expect(screen.queryByText('Escolha o intervalo:')).toBeInTheDocument();
    const dropdown = screen.getByTestId('interval-dropdown');
  
    fireEvent.change(dropdown, { target: { value: '01:00' } });
  
    expect(dropdown.value).toBe('01:00');
  });

  test('should handle valid day change correctly', () => {
    render(
      <MemoryRouter>
        <UpdateRoutine />
      </MemoryRouter>
    );
    
    const selectElement = screen.getByLabelText('Rotina de Registro');
    fireEvent.change(selectElement, { target: { value: 'Mensalmente' } });

    const dayInput = screen.getByTestId('dayInput');
  
    fireEvent.change(dayInput, { target: { value: '15' } });
  
    expect(dayInput.value).toBe('15');
  });

  test('should handle Regional options change correctly', async () => {
    render(
      <MemoryRouter>
        <UpdateRoutine />
      </MemoryRouter>
    );
    
    const cityInput = screen.getByTestId('Cidade');
    const workstationElement = screen.getByTestId('Regional');
    const subWorkstation = screen.getByTestId('Unidade de Trabalho');

    await waitFor(() => {
        fireEvent.change(cityInput, { target: { value: 'City 1' } });
        fireEvent.change(workstationElement, { target: { value: 'WS 1' } });
        fireEvent.change(subWorkstation, { target: { value: 'SW 1' } });
        
        expect(cityInput).toHaveValue('City 1');
        expect(workstationElement).toHaveValue('WS 1');
        expect(subWorkstation).toHaveValue('SW 1');
    });   
  });

  test('displays an error toast when an exception occurs during form submission', async () => {
    addRotina.mockImplementation(() => {
      throw new Error('Erro de teste');
    });
  
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
      expect(toast.error).toHaveBeenCalledWith('Erro ao registrar rotina: Erro de teste');
    });
  });

  test('should generate correct cron expression for weekly routine with specific days and time', async () => {
    render(
      <MemoryRouter>
        <UpdateRoutine />
      </MemoryRouter>
    );
  
    fireEvent.change(screen.getByLabelText('Rotina de Registro'), { target: { value: 'Semanalmente' } });
    fireEvent.click(screen.getByText('D')); 
    fireEvent.click(screen.getByText('T')); 
    fireEvent.change(screen.getByLabelText('Escolha o horário:'), { target: { value: '14:00' } });
  
    fireEvent.click(screen.getByText('Adicionar Rotina'));
  
    await waitFor(() => {
      expect(addRotina).toHaveBeenCalledWith(expect.objectContaining({
        cronExpression: '* 0 14 * * 0,2', 
      }));
    });
  });

    test('should generate correct cron expression for monthly routine with specific day and interval', async () => {
      render(
        <MemoryRouter>
          <UpdateRoutine />
        </MemoryRouter>
      );
    
      fireEvent.change(screen.getByLabelText('Rotina de Registro'), { target: { value: 'Mensalmente' } });
      fireEvent.change(screen.getByLabelText('Digite o dia do mês:'), { target: { value: '15' } });
      fireEvent.change(screen.getByTestId('interval-dropdown'), { target: { value: '01:00' } });
    
      fireEvent.click(screen.getByText('Adicionar Rotina'));
    
      await waitFor(() => {
        expect(addRotina).toHaveBeenCalledWith(expect.objectContaining({
          cronExpression: '* 0 */1 15 * *',
        }));
      });
    });

    test('should handle error when cron expression generation fails', async () => {
      render(
        <MemoryRouter>
          <UpdateRoutine />
        </MemoryRouter>
      );
    
      fireEvent.change(screen.getByLabelText('Rotina de Registro'), { target: { value: 'Diariamente' } });
      fireEvent.change(screen.getByLabelText('Escolha um horário:'), { target: { value: '' } });
    
      fireEvent.click(screen.getByText('Adicionar Rotina'));
    
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    test('should return correct cron pattern for monthly routine with specific day and time', async () => {
      render(
        <MemoryRouter>
           <UpdateRoutine />
        </MemoryRouter>
      );
        
      const selectedCidade = 'City 1';
      const selectedRegional = 'WS 1';
      const selectedUnidade = 'SW 1';
      const day = '15';
      const hora = '10';
      const minuto = '00';
      const routine = 'Mensalmente';
        
      const cronExpression = '* 0 10 15 * *';
        
    const rotinaData = {
      localizacao: `${selectedCidade};${selectedRegional};${selectedUnidade}`,
      dataCriado: new Date(Date.now()).toISOString().split("T")[0],
      cronExpression,
      dataUltimoUpdate: null,
      ativo: true,
      cidadeTodas: selectedCidade === "Todas",
      regionalTodas: selectedRegional === "Todas",
      unidadeTodas: selectedUnidade === "Todas",
    };
        
    addRotina.mockResolvedValue({ type: 'success' });
        
    fireEvent.change(screen.getByLabelText('Rotina de Registro'), { target: { value: routine } });
    fireEvent.change(screen.getByTestId('dayInput'), { target: { value: day } });
    fireEvent.change(screen.getByLabelText('Escolha o horário:'), { target: { value: `${hora}:${minuto}` } });
    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: selectedCidade } });
    fireEvent.change(screen.getByLabelText('Regional'), { target: { value: selectedRegional } });
    fireEvent.change(screen.getByLabelText('Unidade de Trabalho'), { target: { value: selectedUnidade } });
        
    fireEvent.click(screen.getByText('Adicionar Rotina'));
        
    await waitFor(() => {
      expect(addRotina).toHaveBeenCalled();
    });
  });
  
  test('should call toast.error with correct message when validateForm is false', () => {
    render(
      <MemoryRouter>
        <UpdateRoutine 
          validateForm={false}
          routine="Diariamente"
          time=""
          hora={0}
          minuto={10}
          selectedDays={[]}
          day={1}/>
      </MemoryRouter>
    );

    const submitButton = screen.getByText('Adicionar Rotina');
    fireEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith("Por Favor preencha os campos obrigatórios.");
  });

  test('should remove error when at least one day is selected', () => {
    render(
      <MemoryRouter>
        <UpdateRoutine />
      </MemoryRouter>
    );
  
    fireEvent.change(screen.getByLabelText('Rotina de Registro'), {target: { value: 'Semanalmente' } });
  
    fireEvent.click(screen.getByText('Adicionar Rotina')); 
  
    expect(screen.getByText('Escolha o(s) dia(s) da semana')).toBeInTheDocument();
  
    fireEvent.click(screen.getByText('D'));
  
    expect(screen.queryByText('Escolha o(s) dia(s) da semana')).not.toBeInTheDocument();
  });

  test('should show errors when time and interval are not selected for "Mensalmente" routine', () => {
    render(
      <MemoryRouter>
        <UpdateRoutine />
      </MemoryRouter>
    );
  

    fireEvent.change(screen.getByLabelText('Rotina de Registro'), {target: { value: 'Mensalmente' } });
  
    fireEvent.click(screen.getByText('Adicionar Rotina')); 
  
    expect(screen.getByText('Um horário precisa ser escolhido')).toBeInTheDocument();
    expect(screen.getByText('Um intervalo precisa ser escolhido')).toBeInTheDocument();
  
    fireEvent.change(screen.getByLabelText('Escolha o horário:'), { target: { value: '14:00' } });
  
    expect(screen.queryByText('Um horário precisa ser escolhido')).not.toBeInTheDocument();
    expect(screen.queryByText('Um intervalo precisa ser escolhido')).not.toBeInTheDocument();
  });

  test('should navigate to the home page when "Gerar Relatório" button is clicked', () => {
    const navigate = useNavigate();
  
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
  
    expect(navigate).toHaveBeenCalledWith('/');
  });

  test('should set an error when day value is invalid', () => {
    render(
      <MemoryRouter>
        <UpdateRoutine />
      </MemoryRouter>
    );
    
    fireEvent.change(screen.getByLabelText('Rotina de Registro'), {target: { value: 'Mensalmente' } });
    const dayInput = screen.getByLabelText('Digite o dia do mês:'); 
  
    fireEvent.change(dayInput, { target: { value: '29' } });
  
    expect(screen.getByText('Por favor, insira um valor entre 1 e 28')).toBeInTheDocument();
  
    fireEvent.change(dayInput, { target: { value: '15' } });
  
    expect(screen.queryByText('Por favor, insira um valor entre 1 e 28')).not.toBeInTheDocument();
  });
});
