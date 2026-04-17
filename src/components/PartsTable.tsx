// inventory-web/src/components/PartsTable.tsx
import { useState, useEffect } from 'react';
import type { Part, UpdatePart } from '../types';
import PartRow from './PartRow';
import ColumnToggle, { Column, COLUMN_LABELS } from './ColumnToggle';

const STORAGE_KEY = 'tony-visible-columns';
const DEFAULT_VISIBLE: Column[] = ['name'];

function loadVisible(): Set<Column> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return new Set(JSON.parse(stored) as Column[]);
  } catch {}
  return new Set(DEFAULT_VISIBLE);
}

interface Props {
  parts: Part[];
  onAdd: () => void;
  onUpdate: (id: number, data: UpdatePart) => void;
  onDelete: (id: number) => void;
}

export default function PartsTable({ parts, onAdd, onUpdate, onDelete }: Props) {
  const [visible, setVisible] = useState<Set<Column>>(loadVisible);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...visible]));
  }, [visible]);

  const toggle = (col: Column) => {
    setVisible(prev => {
      const next = new Set(prev);
      next.has(col) ? next.delete(col) : next.add(col);
      return next;
    });
  };

  const thStyle = { textAlign: 'left' as const, padding: '8px 12px', color: 'var(--muted)', fontWeight: 500, letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid var(--border)' }}>
        <ColumnToggle visible={visible} onToggle={toggle} />
        <button className="btn-primary" onClick={onAdd}>+ Legg til del</button>
      </div>
      <div style={{ overflow: 'auto', flex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 10 }}>
            <tr>
              <th style={{ ...thStyle, paddingLeft: 16 }}>DELENUMMER</th>
              <th style={thStyle}>ANTALL</th>
              {[...visible].map(col => <th key={col} style={thStyle}>{COLUMN_LABELS[col].toUpperCase()}</th>)}
              <th style={thStyle}>HANDLINGER</th>
            </tr>
          </thead>
          <tbody>
            {parts.length === 0
              ? <tr><td colSpan={3 + visible.size} style={{ padding: '32px 16px', color: 'var(--muted)', textAlign: 'center' }}>Ingen deler funnet</td></tr>
              : parts.map(p => <PartRow key={p.id} part={p} visibleColumns={visible} onUpdate={onUpdate} onDelete={onDelete} />)
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
