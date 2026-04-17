// inventory-web/src/components/PartRow.tsx
import { useState } from 'react';
import type { Part, UpdatePart } from '../types';
import type { Column } from './ColumnToggle';
import VendorBadge from './VendorBadge';

interface Props {
  part: Part;
  visibleColumns: Set<Column>;
  onUpdate: (id: number, data: UpdatePart) => void;
  onDelete: (id: number) => void;
}

function quantityColor(q: number): string {
  if (q === 0) return 'var(--red)';
  if (q === 1) return 'var(--muted)';
  return 'var(--green)';
}

export default function PartRow({ part, visibleColumns, onUpdate, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [draft, setDraft] = useState<UpdatePart>({});

  const openEdit = () => {
    setDraft({ partNumber: part.partNumber, quantity: part.quantity, name: part.name, vendor: part.vendor, location: part.location, notes: part.notes });
    setExpanded(true);
  };

  const save = () => { onUpdate(part.id, draft); setExpanded(false); };
  const cancel = () => { setExpanded(false); setConfirmDelete(false); };

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    onDelete(part.id);
  };

  const monoAccent = { fontFamily: "'IBM Plex Mono', monospace", color: 'var(--accent)', fontSize: 12 };
  const rowStyle = { borderBottom: '1px solid var(--border)', background: expanded ? 'var(--surface2)' : undefined, cursor: 'pointer' };

  if (expanded) {
    return (
      <tr style={rowStyle}>
        <td style={{ padding: '8px 16px' }}>
          <input value={draft.partNumber ?? ''} onChange={e => setDraft({ ...draft, partNumber: e.target.value })} style={{ width: 130, fontFamily: "'IBM Plex Mono', monospace" }} />
        </td>
        <td style={{ padding: '8px 12px' }}>
          <input type="number" value={draft.quantity ?? 0} onChange={e => setDraft({ ...draft, quantity: Number(e.target.value) })} style={{ width: 60, fontFamily: "'IBM Plex Mono', monospace" }} />
        </td>
        {visibleColumns.has('name') && <td style={{ padding: '8px 12px' }}><input value={draft.name ?? ''} onChange={e => setDraft({ ...draft, name: e.target.value || null })} /></td>}
        {visibleColumns.has('vendor') && <td style={{ padding: '8px 12px' }}><input value={draft.vendor ?? ''} onChange={e => setDraft({ ...draft, vendor: e.target.value || null })} /></td>}
        {visibleColumns.has('location') && <td style={{ padding: '8px 12px' }}><input value={draft.location ?? ''} onChange={e => setDraft({ ...draft, location: e.target.value || null })} /></td>}
        {visibleColumns.has('notes') && <td style={{ padding: '8px 12px' }}><input value={draft.notes ?? ''} onChange={e => setDraft({ ...draft, notes: e.target.value || null })} /></td>}
        {visibleColumns.has('createdAt') && <td />}
        <td style={{ padding: '8px 12px' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-primary" onClick={save} style={{ fontSize: 12, padding: '3px 10px' }}>Lagre</button>
            <button className="btn-ghost" onClick={cancel} style={{ fontSize: 12, padding: '3px 10px' }}>Avbryt</button>
            <button className="btn-danger" onClick={handleDelete} style={{ fontSize: 12, padding: '3px 10px' }}>
              {confirmDelete ? 'Bekreft?' : 'Slett'}
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr style={rowStyle} onClick={openEdit}>
      <td style={{ padding: '8px 16px', ...monoAccent }}>{part.partNumber}</td>
      <td style={{ padding: '8px 12px', fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: quantityColor(part.quantity) }}>{part.quantity}</td>
      {visibleColumns.has('name') && <td style={{ padding: '8px 12px' }}>{part.name ?? <span style={{ color: 'var(--muted)' }}>—</span>}</td>}
      {visibleColumns.has('vendor') && <td style={{ padding: '8px 12px' }}>{part.vendor ? <VendorBadge vendor={part.vendor} /> : <span style={{ color: 'var(--muted)' }}>—</span>}</td>}
      {visibleColumns.has('location') && <td style={{ padding: '8px 12px', color: 'var(--muted)', fontSize: 12 }}>{part.location ?? '—'}</td>}
      {visibleColumns.has('notes') && <td style={{ padding: '8px 12px', color: 'var(--muted)', fontSize: 12 }}>{part.notes ?? '—'}</td>}
      {visibleColumns.has('createdAt') && <td style={{ padding: '8px 12px', color: 'var(--muted)', fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}>{new Date(part.createdAt).toLocaleDateString('nb-NO')}</td>}
      <td style={{ padding: '8px 12px' }} onClick={e => e.stopPropagation()}>
        <button className="btn-ghost" disabled={part.quantity === 0} onClick={() => onUpdate(part.id, { quantity: part.quantity - 1 })} style={{ fontSize: 11, padding: '2px 8px' }}>Bruk</button>
      </td>
    </tr>
  );
}
