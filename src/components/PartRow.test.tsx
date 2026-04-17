// inventory-web/src/components/PartRow.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import PartRow from './PartRow';
import type { Part } from '../types';

const part: Part = { id: 1, partNumber: 'BN94-123', quantity: 4, name: 'Hovedkort', vendor: 'Samsung', location: 'Hylle A', notes: null, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' };
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

  it('disables Bruk button when quantity is 0', () => {
    render(<table><tbody><PartRow part={emptyPart} {...baseProps} /></tbody></table>);
    expect(screen.getByRole('button', { name: /bruk/i })).toBeDisabled();
  });

  it('calls onUpdate with quantity - 1 when Bruk is clicked', async () => {
    render(<table><tbody><PartRow part={part} {...baseProps} /></tbody></table>);
    await userEvent.click(screen.getByRole('button', { name: /bruk/i }));
    expect(baseProps.onUpdate).toHaveBeenCalledWith(1, { quantity: 3 });
  });

  it('requires double click to delete', async () => {
    render(<table><tbody><PartRow part={part} {...baseProps} /></tbody></table>);
    await userEvent.click(screen.getByText('BN94-123'));
    const deleteBtn = screen.getByRole('button', { name: /slett/i });
    await userEvent.click(deleteBtn);
    expect(baseProps.onDelete).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /bekreft/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /bekreft/i }));
    expect(baseProps.onDelete).toHaveBeenCalledWith(1);
  });
});
