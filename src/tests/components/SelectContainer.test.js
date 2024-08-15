// tests/components/containers/SelectContainer.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectContainer from '../../components/containers/SelectContainer';

describe('SelectContainer Component', () => {

    test('renders the component with the correct label', () => {
        render(<SelectContainer label="Choose Option" id="select" name="select" options={['Option 1', 'Option 2']} />);
        const labelElement = screen.getByText(/choose option/i);
        expect(labelElement).toBeInTheDocument();
    });

    test('renders the correct options', () => {
        render(<SelectContainer label="Choose Option" id="select" name="select" options={['Option 1', 'Option 2']} />);
        const selectElement = screen.getByRole('combobox');
        const options = screen.getAllByRole('option');
        
        expect(selectElement).toBeInTheDocument();
        expect(options).toHaveLength(3); // "Selecione" + 2 options
        expect(options[0].textContent).toBe('Selecione');
        expect(options[1].textContent).toBe('Option 1');
        expect(options[2].textContent).toBe('Option 2');
    });

    test('applies the correct value to the select element', () => {
        render(<SelectContainer label="Choose Option" id="select" name="select" options={['Option 1', 'Option 2']} value="Option 2" />);
        const selectElement = screen.getByRole('combobox');
        expect(selectElement.value).toBe('Option 2');
    });

    test('calls onChange handler when selection changes', () => {
        const handleChange = jest.fn();
        render(
            <SelectContainer
                label="Choose Option"
                id="select"
                name="select"
                options={['Option 1', 'Option 2']}
                value=""
                onChange={handleChange}
            />
        );
        const selectElement = screen.getByRole('combobox');
        
        // Simulate changing the selected option to "Option 1"
        fireEvent.change(selectElement, { target: { value: 'Option 1' } });
        
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('applies the correct className when error is present', () => {
        const { container } = render(
            <SelectContainer
                label="Choose Option"
                id="select"
                name="select"
                options={['Option 1', 'Option 2']}
                className="custom-class"
                error="Error"
            />
        );
        const selectElement = container.querySelector('select');
        expect(selectElement).toHaveClass('input-error');
        expect(selectElement).toHaveClass('custom-class');
    });
});
