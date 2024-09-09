import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StatusButton from '../../components/containers/StatusButton';

describe('StatusButton', () => {
  test('renders button with "Inativo" text initially', () => {
    render(<StatusButton />);

    const button = screen.getByRole('button', { name: /inativo/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle('background-color: red');
  });

  test('toggles to "Ativo" when clicked', () => {
    render(<StatusButton />);

    const button = screen.getByRole('button', { name: /inativo/i });

    fireEvent.click(button);

    expect(screen.getByRole('button', { name: /ativo/i })).toBeInTheDocument();
    expect(button).toHaveStyle('background-color: green');
  });

  test('toggles back to "Inativo" on second click', () => {
    render(<StatusButton />);

    const button = screen.getByRole('button', { name: /inativo/i });

    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.getByRole('button', { name: /inativo/i })).toBeInTheDocument();
    expect(button).toHaveStyle('background-color: red');
  });
});