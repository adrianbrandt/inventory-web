// inventory-web/src/components/ColumnToggle.tsx
export type Column = 'name' | 'location' | 'vendor' | 'notes' | 'createdAt';

export const COLUMN_LABELS: Record<Column, string> = {
  name: 'Name',
  location: 'Location',
  vendor: 'Vendor',
  notes: 'Notes',
  createdAt: 'Date',
};

interface Props {
  visible: Set<Column>;
  onToggle: (col: Column) => void;
}

export default function ColumnToggle({ visible, onToggle }: Props) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {(Object.keys(COLUMN_LABELS) as Column[]).map(col => {
        const active = visible.has(col);
        return (
          <button
            key={col}
            onClick={() => onToggle(col)}
            style={{
              fontSize: 11,
              fontFamily: "'IBM Plex Mono', monospace",
              padding: '3px 8px',
              background: active ? 'var(--accent)22' : 'transparent',
              border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
              color: active ? 'var(--accent)' : 'var(--muted)',
            }}
          >
            {COLUMN_LABELS[col]}
          </button>
        );
      })}
    </div>
  );
}
