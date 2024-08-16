// tests/components/containers/NumberContainer.test.js
import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NumberContainer from '../../components/containers/NumberContainer';

// Simulate a parent component to test the NumberContainer's behavior
function NumberContainerWithParent() {
    const [value, setValue] = useState(100);

    return (
        <NumberContainer
            label="Amount"
            id="amount"
            name="amount"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
        />
    );
}

describe('NumberContainer Component', () => {

    test('renders the component with the correct label', () => {
        render(<NumberContainer label="Amount" id="amount" name="amount" />);
        const labelElement = screen.getByText(/amount/i);
        expect(labelElement).toBeInTheDocument();
    });

    test('applies the correct value to the input field', () => {
        render(<NumberContainer label="Amount" id="amount" name="amount" value={100} />);
        const inputElement = screen.getByDisplayValue('100');
        expect(inputElement).toBeInTheDocument();
    });

    test('calls onChange handler and updates value when input changes', () => {
        render(<NumberContainerWithParent />);
        const inputElement = screen.getByRole('spinbutton');

        // Simulate changing the input value to 200
        fireEvent.change(inputElement, { target: { value: 200 } });

        // Verify that the value has been updated to 200
        expect(inputElement.value).toBe('200');
    });

    test('applies the correct className when error is present', () => {
        const { container } = render(
            <NumberContainer label="Amount" id="amount" name="amount" value={100} error="Error" className="custom-class" />
        );
        const inputElement = container.querySelector('input');
        expect(inputElement).toHaveClass('input-error');
        expect(inputElement).toHaveClass('custom-class');
    });

    test('disables the input when the disabled prop is true', () => {
        render(<NumberContainer label="Amount" id="amount" name="amount" value={100} disabled />);
        const inputElement = screen.getByRole('spinbutton');
        expect(inputElement).toBeDisabled();
    });
});
