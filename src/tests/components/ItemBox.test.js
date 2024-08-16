import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ItemBox from '../../components/containers/ItemBox';

describe('ItemBox Component', () => {

    test('renders the component with the correct label', () => {
        render(<ItemBox label="Test Label" />);
        const labelElement = screen.getByText(/test label/i);
        expect(labelElement).toBeInTheDocument();
    });

    test('toggle button changes state and icon when clicked', () => {
        render(<ItemBox label="Test Label" />);
        const toggleButtons = screen.getAllByRole('button');
        const toggleButton = toggleButtons[1];
        expect(toggleButton.querySelector('svg')).toBeTruthy();
        fireEvent.click(toggleButton);
        expect(toggleButton.querySelector('svg')).toBeTruthy();
        fireEvent.click(toggleButton);
        expect(toggleButton.querySelector('svg')).toBeTruthy();
    });

    test('calls onEditClick when the edit button is clicked', () => {
        const handleEditClick = jest.fn();
        render(<ItemBox label="Test Label" onEditClick={handleEditClick} />);
        const editButton = screen.getAllByRole('button')[0];
        fireEvent.click(editButton);
        expect(handleEditClick).toHaveBeenCalledTimes(1);
    });

    test('calls onToggleClick when the toggle button is clicked', () => {
        const handleToggleClick = jest.fn();
        render(<ItemBox label="Test Label" onToggleClick={handleToggleClick} />);        
        const toggleButtons = screen.getAllByRole('button');
        const toggleButton = toggleButtons[1];

        fireEvent.click(toggleButton);
        expect(handleToggleClick).toHaveBeenCalledTimes(1);
    });
});