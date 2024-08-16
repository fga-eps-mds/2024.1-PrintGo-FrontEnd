import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/Button';

describe('Button Component', () => {
    
    test('renders with the correct classes based on props', () => {
        const { container } = render(<Button type="success" size="large" text="Click Me" bgColor="#4caf50" onClick={() => {}} />);
        
        const button = container.querySelector('button');
        expect(button).toHaveClass('button');
        expect(button).toHaveClass('button-success');
        expect(button).toHaveClass('button-large');
        expect(button).toHaveStyle('background: #4caf50');
    });

    test('displays the correct text', () => {
        render(<Button type="info" size="medium" text="Submit" bgColor="#2196f3" onClick={() => {}} />);
        
        const button = screen.getByText(/submit/i);
        expect(button).toBeInTheDocument();
    });

    test('calls the onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(<Button type="error" size="small" text="Delete" bgColor="#f44336" onClick={handleClick} />);
        
        const button = screen.getByText(/delete/i);
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('applies default props when none are provided', () => {
        const { container } = render(<Button text="Default" bgColor="#ccc" onClick={() => {}} />);
        
        const button = container.querySelector('button');
        expect(button).toHaveClass('button-info');
        expect(button).toHaveClass('button-medium');
    });
});
