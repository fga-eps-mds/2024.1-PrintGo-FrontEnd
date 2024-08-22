import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DateContainer from '../../components/containers/DateContainer';

describe('DateContainer Component', () => {
    
    test('renders the component with the correct label', () => {
        render(<DateContainer label="Date of Birth" onChange={() => {}} />);
        const labelElement = screen.getByText(/date of birth/i);
        expect(labelElement).toBeInTheDocument();
    });

    test('applies the correct value to the input field', () => {
        render(<DateContainer label="Date" value="2024-08-08" onChange={() => {}} />);
        const inputElement = screen.getByDisplayValue('2024-08-08');
        expect(inputElement).toBeInTheDocument();
    });

    test('calls onChange handler when input value changes', () => {
        const handleChange = jest.fn();
        render(<DateContainer label="Date" onChange={handleChange} />);
        const labelElement = screen.getByText(/date/i);
        const inputElement = labelElement.closest('div').querySelector('input');
        fireEvent.change(inputElement, { target: { value: '2024-08-09' } });
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('applies the correct className when error is present', () => {
        const { container } = render(<DateContainer label="Date" error="Error" className="custom-class" onChange={() => {}} />);
        const inputElement = container.querySelector('input');
        expect(inputElement).toHaveClass('input-error');
        expect(inputElement).toHaveClass('custom-class');
    });

    test('applies the correct className when error is not present', () => {
        const { container } = render(<DateContainer label="Date" className="custom-class" onChange={() => {}} />);
        const inputElement = container.querySelector('input');
        expect(inputElement).toHaveClass('number-field');
        expect(inputElement).toHaveClass('custom-class');
    });

    test('renders with default value when value is not provided', () => {
        const { container } = render(<DateContainer label="Date" onChange={() => {}} />);
        const inputElement = container.querySelector('input');
        expect(inputElement).toHaveValue('');
    });
});
