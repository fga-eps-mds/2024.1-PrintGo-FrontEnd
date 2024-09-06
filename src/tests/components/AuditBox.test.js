import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuditBox from '../../components/containers/AuditBox';

// Mock para o arquivo de imagem
jest.mock('../../assets/report.png', () => 'test-file-stub');

describe('AuditBox Component', () => {
    test('renders the component with the correct label', () => {
        render(<AuditBox equipamento="Test Equipamento" contadorCor={50} contadorPB={50} contadorLocCor={50} contadorLocPB={50} totLoc={100} marginError={5} />);
        const labelElement = screen.getByText(/Test Equipamento/i);
        expect(labelElement).toBeInTheDocument();
    });

    test('applies the error class when marginError is exceeded', () => {
        render(<AuditBox equipamento="Test Equipamento" contadorCor={50} contadorPB={50} contadorLocCor={50} contadorLocPB={50} totLoc={200} marginError={5} />);
        const boxElement = screen.getByText(/test equipamento/i).closest('.box');
        expect(boxElement).toHaveClass('box-error');
    });

    test('does not apply the error class when within marginError', () => {
        render(<AuditBox equipamento="Test Equipamento" contadorCor={50} contadorPB={50} contadorLocCor={50} contadorLocPB={50} totLoc={105} marginError={10} />);
        const boxElement = screen.getByText(/test equipamento/i).closest('.box');
        expect(boxElement).not.toHaveClass('box-error');
    });

    test('calls the onClick handler when the button is clicked', () => {
        const handleClick = jest.fn();
        render(<AuditBox equipamento="Test Equipamento" onClick={handleClick} />);
        const buttonElement = screen.getByRole('button');
        buttonElement.click();
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});

