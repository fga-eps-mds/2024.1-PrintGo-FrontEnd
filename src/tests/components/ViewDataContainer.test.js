// tests/components/containers/ViewDataContainer.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ViewDataContainer from '../../components/containers/ViewDataContainer';

describe('ViewDataContainer Component', () => {

    test('renders the component with the correct label name and value', () => {
        render(<ViewDataContainer labelName="Username" value="JohnDoe" id="username" name="username" />);
        const labelElement = screen.getByText(/username/i);
        const valueElement = screen.getByText(/johndoe/i);

        expect(labelElement).toBeInTheDocument();
        expect(valueElement).toBeInTheDocument();
    });

    test('applies the correct className and id to the label', () => {
        render(<ViewDataContainer labelName="Username" value="JohnDoe" id="username" name="username" className="custom-class" />);
        const labelElement = screen.getByText(/johndoe/i);

        expect(labelElement).toHaveClass('custom-class');
        expect(labelElement).toHaveAttribute('id', 'username');
        expect(labelElement).toHaveAttribute('name', 'username');
    });

    test('applies the disabled-cursor class when the label is hovered', () => {
        render(<ViewDataContainer labelName="Username" value="JohnDoe" id="username" name="username" />);
        const labelElement = screen.getByText(/johndoe/i);
        
        fireEvent.mouseEnter(labelElement);
        expect(labelElement).toHaveClass('disabled-cursor');

        fireEvent.mouseLeave(labelElement);
        expect(labelElement).not.toHaveClass('disabled-cursor');
    });

});
