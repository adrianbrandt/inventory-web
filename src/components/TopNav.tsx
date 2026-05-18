// inventory-web/src/components/TopNav.tsx
import { useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

interface Props {
  partCount: number;
  onExportCsv: () => void;
  onImportCsv: (file: File) => void;
  importStatus?: string;
}

export default function TopNav({ partCount, onExportCsv, onImportCsv, importStatus }: Props) {
  const { logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportCsv(file);
      e.target.value = '';
    }
  };

  return (
    <nav style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100 }}>
      <span style={{ color: 'var(--accent)', fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: '0.08em' }}>INVENTORY</span>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {importStatus && (
          <span style={{ color: 'var(--green)', fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}>{importStatus}</span>
        )}
        <span style={{ color: 'var(--muted)', fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}>{partCount} parts</span>
        <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileChange} />
        <button className="btn-ghost" onClick={() => fileInputRef.current?.click()} style={{ fontSize: 11 }}>Import CSV</button>
        <button className="btn-ghost" onClick={onExportCsv} style={{ fontSize: 11 }}>Export CSV</button>
        <button className="btn-danger" onClick={logout} style={{ fontSize: 11 }}>Log out</button>
      </div>
    </nav>
  );
}
