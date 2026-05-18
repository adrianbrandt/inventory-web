// inventory-web/src/components/StatsRow.tsx
import type { Stats } from '../types';

const card = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 16px', minWidth: 90 };
const label = { color: 'var(--muted)', fontSize: 11 };
const num = (color: string) => ({ color, fontSize: 20, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" });

export default function StatsRow({ stats }: { stats: Stats }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
      <div style={card}><div style={num('var(--accent)')}>{stats.total}</div><div style={label}>Total parts</div></div>
      <div style={card}><div style={num(stats.outOfStock > 0 ? 'var(--red)' : 'var(--accent)')}>{stats.outOfStock}</div><div style={label}>Out of stock</div></div>
      <div style={card}><div style={num('var(--accent)')}>{stats.vendors}</div><div style={label}>Vendors</div></div>
      <div style={card}><div style={num('var(--accent)')}>{stats.totalUnits}</div><div style={label}>Total units</div></div>
    </div>
  );
}
