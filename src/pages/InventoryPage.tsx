// inventory-web/src/pages/InventoryPage.tsx
import { useState, useRef } from 'react';
import type { Filters, Part } from '../types';
import TopNav from '../components/TopNav';
import Sidebar from '../components/Sidebar';
import StatsRow from '../components/StatsRow';
import PartsTable from '../components/PartsTable';
import AddPartModal from '../components/AddPartModal';
import { useParts, useCreatePart, useUpdatePart, useDeletePart } from '../hooks/useParts';
import { useStats } from '../hooks/useStats';
import { createPart as apiCreatePart } from '../api/parts';
import { useQueryClient } from '@tanstack/react-query';

function exportCsv(parts: Part[]) {
  const header = 'Delenummer,Antall,Navn,Leverandør,Lokasjon,Notater,Dato';
  const rows = parts.map(p => [p.partNumber, p.quantity, p.name ?? '', p.vendor ?? '', p.location ?? '', p.notes ?? '', new Date(p.createdAt).toLocaleDateString('nb-NO')].join(','));
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'varelager.csv';
  a.click();
}

function parseCsv(text: string): Array<{ partNumber: string; quantity: number }> {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .flatMap(line => {
      const [rawPart, rawQty] = line.split(',');
      const partNumber = rawPart?.trim();
      const quantity = parseInt(rawQty?.trim() ?? '', 10);
      if (!partNumber || isNaN(quantity) || quantity < 0) return [];
      return [{ partNumber, quantity }];
    });
}

export default function InventoryPage() {
  const [filters, setFilters] = useState<Filters>({});
  const [showModal, setShowModal] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const importTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const qc = useQueryClient();

  const { data: parts = [], isLoading } = useParts(filters);
  const { data: stats } = useStats();
  const createPart = useCreatePart();
  const updatePart = useUpdatePart();
  const deletePart = useDeletePart();

  const allVendors = [...new Set(parts.map(p => p.vendor).filter((v): v is string => Boolean(v)))];
  const allLocations = [...new Set(parts.map(p => p.location).filter((l): l is string => Boolean(l)))];

  const handleImportCsv = async (file: File) => {
    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length === 0) { setImportStatus('Ingen gyldige rader funnet'); return; }

    const results = await Promise.allSettled(rows.map(row => apiCreatePart(row)));
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    qc.invalidateQueries({ queryKey: ['parts'] });
    qc.invalidateQueries({ queryKey: ['stats'] });

    const msg = failed > 0 ? `Importerte ${succeeded} deler (${failed} feilet)` : `Importerte ${succeeded} deler`;
    setImportStatus(msg);
    if (importTimerRef.current) clearTimeout(importTimerRef.current);
    importTimerRef.current = setTimeout(() => setImportStatus(''), 4000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopNav partCount={parts.length} onExportCsv={() => exportCsv(parts)} onImportCsv={handleImportCsv} importStatus={importStatus} />
      <div style={{ display: 'flex', height: 'calc(100vh - 56px)' }}>
        <Sidebar filters={filters} vendors={allVendors} locations={allLocations} onChange={setFilters} />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {stats && <StatsRow stats={stats} />}
          {isLoading
            ? <div style={{ padding: '32px 16px', color: 'var(--muted)', textAlign: 'center' }}>Laster…</div>
            : <PartsTable parts={parts} onAdd={() => setShowModal(true)} onUpdate={(id, data) => updatePart.mutate({ id, data })} onDelete={(id) => deletePart.mutate(id)} />
          }
        </main>
      </div>
      {showModal && <AddPartModal onClose={() => setShowModal(false)} onSubmit={data => createPart.mutateAsync(data)} />}
    </div>
  );
}
