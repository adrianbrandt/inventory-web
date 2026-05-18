import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import AddPartModal from './AddPartModal';

const onClose = vi.fn();
const onSubmit = vi.fn();

describe('AddPartModal', () => {
  it('renders part number and quantity fields', () => {
    render(<AddPartModal onClose={onClose} onSubmit={onSubmit} />);
    expect(screen.getByPlaceholderText(/part number/i)).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('disables submit when partNumber is empty', () => {
    render(<AddPartModal onClose={onClose} onSubmit={onSubmit} />);
    expect(screen.getByRole('button', { name: /^add$/i })).toBeDisabled();
  });

  it('calls onSubmit with form data', async () => {
    onSubmit.mockResolvedValue(undefined);
    render(<AddPartModal onClose={onClose} onSubmit={onSubmit} />);
    await userEvent.type(screen.getByPlaceholderText(/part number/i), 'BN94-999');
    await userEvent.clear(screen.getByRole('spinbutton'));
    await userEvent.type(screen.getByRole('spinbutton'), '5');
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ partNumber: 'BN94-999', quantity: 5 }));
  });
});
