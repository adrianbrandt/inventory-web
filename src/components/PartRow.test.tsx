import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import PartRow from './PartRow';
import type { Part } from '../types';

const part: Part = {
  id: 1, partNumber: 'BN94-123', quantity: 4, name: 'Motherboard',
  vendor: 'Samsung', location: 'Shelf A', notes: null,
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
};
const emptyPart: Part = { ...part, id: 2, quantity: 0 };

const baseProps = {
  visibleColumns: new Set(['name', 'vendor', 'location', 'notes', 'createdAt'] as const),
  onUpdate: vi.fn(),
  onDelete: vi.fn(),
};

describe('PartRow', () => {
  it('renders part number and quantity', () => {
    render(<table><tbody><PartRow part={part} {...baseProps} /></tbody></table>);
    expect(screen.getByText('BN94-123')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('disables -1 button when quantity is 0', () => {
    render(<table><tbody><PartRow part={emptyPart} {...baseProps} /></tbody></table>);
    expect(screen.getByRole('button', { name: '-1' })).toBeDisabled();
  });

  it('calls onUpdate with quantity - 1 when -1 is clicked', async () => {
    render(<table><tbody><PartRow part={part} {...baseProps} /></tbody></table>);
    await userEvent.click(screen.getByRole('button', { name: '-1' }));
    expect(baseProps.onUpdate).toHaveBeenCalledWith(1, { quantity: 3 });
  });

  it('calls onUpdate with quantity + 1 when +1 is clicked', async () => {
    render(<table><tbody><PartRow part={part} {...baseProps} /></tbody></table>);
    await userEvent.click(screen.getByRole('button', { name: '+1' }));
    expect(baseProps.onUpdate).toHaveBeenCalledWith(1, { quantity: 5 });
  });

  it('+1 is enabled even when quantity is 0', () => {
    render(<table><tbody><PartRow part={emptyPart} {...baseProps} /></tbody></table>);
    expect(screen.getByRole('button', { name: '+1' })).not.toBeDisabled();
  });

  it('requires double click to delete', async () => {
    render(<table><tbody><PartRow part={part} {...baseProps} /></tbody></table>);
    await userEvent.click(screen.getByText('BN94-123'));
    const deleteBtn = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteBtn);
    expect(baseProps.onDelete).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /confirm\?/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /confirm\?/i }));
    expect(baseProps.onDelete).toHaveBeenCalledWith(1);
  });
});
