// inventory-web/src/pages/LoginPage.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LoginPage from './LoginPage';

const mockLogin = vi.fn();
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ login: mockLogin, user: null, loading: false, logout: vi.fn() }),
}));

describe('LoginPage', () => {
  it('renders username and password inputs', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('brukernavn')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('calls login with entered credentials', async () => {
    mockLogin.mockResolvedValue(undefined);
    render(<LoginPage />);
    await userEvent.type(screen.getByPlaceholderText('brukernavn'), 'admin');
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'secret');
    await userEvent.click(screen.getByRole('button', { name: /logg inn/i }));
    expect(mockLogin).toHaveBeenCalledWith('admin', 'secret');
  });

  it('shows error message on failed login', async () => {
    mockLogin.mockRejectedValue(new Error('Feil brukernavn eller passord'));
    render(<LoginPage />);
    await userEvent.type(screen.getByPlaceholderText('brukernavn'), 'admin');
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: /logg inn/i }));
    expect(await screen.findByText('Feil brukernavn eller passord')).toBeInTheDocument();
  });
});
