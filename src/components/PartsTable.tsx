import { useState, useEffect } from 'react';
import type { Part, UpdatePart } from '../types';
import PartRow from './PartRow';
import ColumnToggle, { Column, COLUMN_LABELS } from './ColumnToggle';
import { sortParts, SortKey, SortDir } from '../utils/sort';

const STORAGE_KEY = 'inventory-visible-columns';
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

const COLUMN_SORT_KEY: Partial<Record<Column, SortKey>> = {
  name: 'name',
  vendor: 'vendor',
  location: 'location',
  createdAt: 'createdAt',
};

export default function PartsTable({ parts, onAdd, onUpdate, onDelete }: Props) {
  const [visible, setVisible] = useState<Set<Column>>(loadVisible);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

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

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortIcon = (key: SortKey) =>
    sortKey === key
      ? <span style={{ marginLeft: 4, color: 'var(--accent)' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>
      : <span style={{ marginLeft: 4, color: 'var(--border2)' }}>▲▼</span>;

  const sorted = sortParts(parts, sortKey, sortDir);

  const thBase = { textAlign: 'left' as const, padding: '8px 12px', color: 'var(--muted)', fontWeight: 500, letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" };
  const thSortable = { ...thBase, cursor: 'pointer', userSelect: 'none' as const };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid var(--border)' }}>
        <ColumnToggle visible={visible} onToggle={toggle} />
        <button className="btn-primary" onClick={onAdd}>+ Add Part</button>
      </div>
      <div style={{ overflow: 'auto', flex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 10 }}>
            <tr>
              <th style={{ ...thSortable, paddingLeft: 16 }} onClick={() => handleSort('partNumber')}>
                PART NUMBER{sortIcon('partNumber')}
              </th>
              <th style={thSortable} onClick={() => handleSort('quantity')}>
                QUANTITY{sortIcon('quantity')}
              </th>
              {[...visible].map(col => {
                const sk = COLUMN_SORT_KEY[col];
                return sk
                  ? <th key={col} style={thSortable} onClick={() => handleSort(sk)}>{COLUMN_LABELS[col].toUpperCase()}{sortIcon(sk)}</th>
                  : <th key={col} style={thBase}>{COLUMN_LABELS[col].toUpperCase()}</th>;
              })}
              <th style={thBase}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0
              ? <tr><td colSpan={3 + visible.size} style={{ padding: '32px 16px', color: 'var(--muted)', textAlign: 'center' }}>No parts found</td></tr>
              : sorted.map(p => <PartRow key={p.id} part={p} visibleColumns={visible} onUpdate={onUpdate} onDelete={onDelete} />)
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
