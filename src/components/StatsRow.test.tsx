// inventory-web/src/components/StatsRow.test.tsx
import { render, screen } from '@testing-library/react';
import StatsRow from './StatsRow';

const stats = { total: 10, outOfStock: 3, vendors: 5, totalUnits: 88 };

describe('StatsRow', () => {
  it('renders all four stat values', () => {
    render(<StatsRow stats={stats} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('88')).toBeInTheDocument();
  });

  it('colors outOfStock red when greater than 0', () => {
    render(<StatsRow stats={stats} />);
    const el = screen.getByText('3');
    expect(el).toHaveStyle({ color: 'var(--red)' });
  });
});
