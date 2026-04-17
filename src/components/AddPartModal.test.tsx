// inventory-web/src/components/AddPartModal.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import AddPartModal from './AddPartModal';

const onClose = vi.fn();
const onSubmit = vi.fn();

describe('AddPartModal', () => {
  it('renders required fields', () => {
    render(<AddPartModal onClose={onClose} onSubmit={onSubmit} />);
    expect(screen.getByPlaceholderText(/delenummer/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/antall/i)).toBeInTheDocument();
  });

  it('disables submit when partNumber is empty', () => {
    render(<AddPartModal onClose={onClose} onSubmit={onSubmit} />);
    expect(screen.getByRole('button', { name: /legg til/i })).toBeDisabled();
  });

  it('calls onSubmit with form data', async () => {
    onSubmit.mockResolvedValue(undefined);
    render(<AddPartModal onClose={onClose} onSubmit={onSubmit} />);
    await userEvent.type(screen.getByPlaceholderText(/delenummer/i), 'BN94-999');
    await userEvent.clear(screen.getByPlaceholderText(/antall/i));
    await userEvent.type(screen.getByPlaceholderText(/antall/i), '5');
    await userEvent.click(screen.getByRole('button', { name: /legg til/i }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ partNumber: 'BN94-999', quantity: 5 }));
  });
});
