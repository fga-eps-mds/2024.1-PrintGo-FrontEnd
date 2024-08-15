import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuditBox from '../../components/containers/AuditBox';

describe('AuditBox Component', () => {

    test('renders the component with the correct label', () => {
        render(<AuditBox equipamento="Test Equipamento" contadorAtual={100} contadorLoc={100} totPrintgo={50} totLoc={50} marginError={5} />);
        const labelElement = screen.getByText(/Test Equipamento/i);
        expect(labelElement).toBeInTheDocument();
    });

    test('applies the error class when marginError is exceeded', () => {
        render(<AuditBox equipamento="Test Equipamento" contadorAtual={100} contadorLoc={80} totPrintgo={50} totLoc={30} marginError={5} />);
        const boxElement = screen.getByText(/test equipamento/i).closest('.box');
        expect(boxElement).toHaveClass('box-error');
    });

    test('does not apply the error class when within marginError', () => {
        render(<AuditBox equipamento="Test Equipamento" contadorAtual={100} contadorLoc={95} totPrintgo={50} totLoc={48} marginError={10} />);
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