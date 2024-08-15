import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../../components/Input';

describe('Input Component', () => {
    
    test('renders the input with the correct label', () => {
        render(<Input label="Username" />);
        const labelElement = screen.getByText(/username/i);
        expect(labelElement).toBeInTheDocument();
    });

    test('renders the input with the correct placeholder', () => {
        render(<Input placeholder="Enter your username" />);
        const inputElement = screen.getByPlaceholderText(/enter your username/i);
        expect(inputElement).toBeInTheDocument();
    });

    test('applies the correct className', () => {
        const { container } = render(<Input className="custom-input" />);
        const inputElement = container.querySelector('input');
        expect(inputElement).toHaveClass('custom-input');
    });

    test('calls onChange handler when input value changes', () => {
        const handleChange = jest.fn();
        render(<Input onChange={handleChange} />);
        const inputElement = screen.getByRole('textbox');
        fireEvent.change(inputElement, { target: { value: 'new value' } });
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('renders without label if no label prop is provided', () => {
        render(<Input />);
        const labelElement = screen.queryByText(/label/i);
        expect(labelElement).not.toBeInTheDocument();
    });

    test('renders with default input element when no className is provided', () => {
        const { container } = render(<Input />);
        const inputElement = container.querySelector('input');
        expect(inputElement).toBeInTheDocument();
        expect(inputElement).not.toHaveClass();
    });
});
