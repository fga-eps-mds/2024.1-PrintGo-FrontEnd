import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InputContainer from '../../components/containers/InputContainer';

describe('InputContainer Component', () => {

    test('renders the component with the correct label', () => {
        render(<InputContainer label="Username" value="" onChange={() => {}} />);
        const labelElement = screen.getByText(/username/i);
        expect(labelElement).toBeInTheDocument();
    });

    test('renders the input with the correct placeholder', () => {
        render(<InputContainer label="Username" placeholder="Enter your username" value="" onChange={() => {}} />);
        const inputElement = screen.getByPlaceholderText(/enter your username/i);
        expect(inputElement).toBeInTheDocument();
    });

    test('applies the correct value to the input field', () => {
        render(<InputContainer label="Username" value="JohnDoe" onChange={() => {}} />);
        const inputElement = screen.getByDisplayValue('JohnDoe');
        expect(inputElement).toBeInTheDocument();
    });

    test('calls onChange handler with correct value when input changes', () => {
        const handleChange = jest.fn();
        render(<InputContainer label="Username" value="" onChange={handleChange} />);
        const inputElement = screen.getByRole('textbox');
        fireEvent.change(inputElement, { target: { value: 'JaneDoe' } });
        expect(handleChange).toHaveBeenCalledWith('JaneDoe');
    });

    test('applies the correct className when error is present', () => {
        const { container } = render(<InputContainer label="Username" value="" error="Error" className="custom-class" onChange={() => {}} />);
        const inputElement = container.querySelector('input');
        expect(inputElement).toHaveClass('input-error');
        expect(inputElement).toHaveClass('custom-class');
    });

    test('applies the correct className when error is not present', () => {
        const { container } = render(<InputContainer label="Username" value="" className="custom-class" onChange={() => {}} />);
        const inputElement = container.querySelector('input');
        expect(inputElement).toHaveClass('input-field');
        expect(inputElement).toHaveClass('custom-class');
    });
});
