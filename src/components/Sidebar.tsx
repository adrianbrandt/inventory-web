// inventory-web/src/components/Sidebar.tsx
import type { Filters } from '../types';

interface Props {
  filters: Filters;
  vendors: string[];
  locations: string[];
  onChange: (filters: Filters) => void;
}

const sectionStyle = { padding: '14px 16px', borderBottom: '1px solid var(--border)' };
const labelStyle = { color: 'var(--muted)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' as const, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6, display: 'block' };

export default function Sidebar({ filters, vendors, locations, onChange }: Props) {
  const toggleVendor = (v: string) => {
    const cur = filters.vendor ?? [];
    const next = cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v];
    onChange({ ...filters, vendor: next.length ? next : undefined });
  };

  const toggleLocation = (l: string) => {
    const cur = filters.location ?? [];
    const next = cur.includes(l) ? cur.filter(x => x !== l) : [...cur, l];
    onChange({ ...filters, location: next.length ? next : undefined });
  };

  const reset = () => onChange({});

  return (
    <aside style={{ width: 220, minWidth: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)', overflowY: 'auto', height: 'calc(100vh - 56px)', position: 'sticky', top: 56 }}>
      <div style={sectionStyle}>
        <label style={labelStyle}>SØK</label>
        <input value={filters.q ?? ''} onChange={e => onChange({ ...filters, q: e.target.value || undefined })} placeholder="Delenummer, navn…" style={{ width: '100%' }} />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>LAGERSTATUS</label>
        {(['', 'stocked', 'empty'] as const).map((val, i) => (
          <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, marginBottom: i < 2 ? 5 : 0, cursor: 'pointer' }}>
            <input type="radio" name="stock" checked={(filters.stock ?? '') === val} onChange={() => onChange({ ...filters, stock: val || undefined })} style={{ accentColor: 'var(--accent)' }} />
            {['Alle', 'På lager', 'Tomt'][i]}
          </label>
        ))}
      </div>

      {vendors.length > 0 && (
        <div style={sectionStyle}>
          <label style={labelStyle}>LEVERANDØR</label>
          {vendors.map(v => (
            <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, marginBottom: 5, cursor: 'pointer' }}>
              <input type="checkbox" checked={(filters.vendor ?? []).includes(v)} onChange={() => toggleVendor(v)} style={{ accentColor: 'var(--accent)' }} />
              {v}
            </label>
          ))}
        </div>
      )}

      {locations.length > 0 && (
        <div style={sectionStyle}>
          <label style={labelStyle}>LOKASJON</label>
          {locations.map(l => (
            <label key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, marginBottom: 5, cursor: 'pointer' }}>
              <input type="checkbox" checked={(filters.location ?? []).includes(l)} onChange={() => toggleLocation(l)} style={{ accentColor: 'var(--accent)' }} />
              {l}
            </label>
          ))}
        </div>
      )}

      <div style={{ padding: '14px 16px' }}>
        <button className="btn-ghost" onClick={reset} style={{ width: '100%' }}>Nullstill filter</button>
      </div>
    </aside>
  );
}
