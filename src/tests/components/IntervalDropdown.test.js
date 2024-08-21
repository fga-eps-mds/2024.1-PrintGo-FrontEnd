import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import IntervalDropdown from '../../components/containers/IntervalDropdown';

describe('IntervalDropdown', () => {
    const handleChange = jest.fn();
    
    test('renders the component with default props', () => {
        render(<IntervalDropdown onChange={handleChange}/>);
        const selectElement = screen.getByRole('combobox');
        expect(selectElement).toBeInTheDocument();
        expect(selectElement).toHaveValue('');
    });
  
    test('renders the component with a value', () => {
        render(<IntervalDropdown onChange={handleChange} value="00:15" />);
        const selectElement = screen.getByRole('combobox');
        expect(selectElement).toHaveValue('00:15');
    });
  
    test('calls onChange when an option is selected', () => {
        let value = '';
        const handleChange = jest.fn((event) => value = event.target.value);
        
        const { rerender } = render(<IntervalDropdown value={value} onChange={handleChange} />);
        
        const selectElement = screen.getByRole('combobox');
        fireEvent.change(selectElement, { target: { value: '01:00' } });
        
        expect(handleChange).toHaveBeenCalledTimes(1);
        
        rerender(<IntervalDropdown value={value} onChange={handleChange} />);
        expect(selectElement).toHaveValue('01:00');
    });
  
    test('applies the error class when there is an error', () => {
        render(<IntervalDropdown onChange={handleChange} error="error" className="dropdown" />);
        const selectElement = screen.getByRole('combobox');
        expect(selectElement).toHaveClass('dropdown input-error');
    });
  
    test('renders all options', () => {
        render(<IntervalDropdown onChange={handleChange}/>);
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(17); // 16 opções incluindo a opção vazia "Escolha"
    });

    test('applies the correct value to the select element', () => {
        render(<IntervalDropdown value="11:00" onChange={() => {handleChange}}/>);
        const selectElement = screen.getByRole('combobox');
        expect(selectElement.value).toBe('11:00');
    });
  });