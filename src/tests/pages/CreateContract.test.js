import React from 'react';
import { render, screen } from '@testing-library/react';
import CreateUserPage from '../../pages/CreateCrontract';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/navbar/Navbar', () => () => <div>Mocked Navbar</div>);
jest.mock('../../components/forms/ContractForm', () => () => <div>Mocked ContractForm</div>);

describe('CreateUserPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Navbar and ContractForm components', () => {
    render(
      <MemoryRouter>
        <CreateUserPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Mocked Navbar')).toBeInTheDocument();

    expect(screen.getByText('Mocked ContractForm')).toBeInTheDocument();
  });
});