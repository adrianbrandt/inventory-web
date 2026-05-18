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
    expect(screen.getByPlaceholderText('username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('calls login with entered credentials', async () => {
    mockLogin.mockResolvedValue(undefined);
    render(<LoginPage />);
    await userEvent.type(screen.getByPlaceholderText('username'), 'admin');
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'secret');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(mockLogin).toHaveBeenCalledWith('admin', 'secret');
  });

  it('shows error message on failed login', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid username or password'));
    render(<LoginPage />);
    await userEvent.type(screen.getByPlaceholderText('username'), 'admin');
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText('Invalid username or password')).toBeInTheDocument();
  });
});
