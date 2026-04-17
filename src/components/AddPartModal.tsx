// inventory-web/src/components/AddPartModal.tsx
import { useState, FormEvent } from 'react';
import type { CreatePart } from '../types';

interface Props {
  onClose: () => void;
  onSubmit: (data: CreatePart) => Promise<void>;
}

const field = { display: 'flex' as const, flexDirection: 'column' as const, gap: 4, marginBottom: 12 };
const labelStyle = { color: 'var(--muted)', fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase' as const, letterSpacing: '0.05em' };

export default function AddPartModal({ onClose, onSubmit }: Props) {
  const [partNumber, setPartNumber] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [name, setName] = useState('');
  const [vendor, setVendor] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit({ partNumber, quantity, name: name || undefined, vendor: vendor || undefined, location: location || undefined, notes: notes || undefined });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ukjent feil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000a', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={onClose}>
      <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, width: '100%', maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: '0.08em', marginBottom: 20, color: 'var(--accent)' }}>LEGG TIL DEL</h3>

        <div style={field}>
          <label style={labelStyle}>Delenummer *</label>
          <input value={partNumber} onChange={e => setPartNumber(e.target.value)} placeholder="Delenummer" autoFocus style={{ width: '100%' }} />
        </div>
        <div style={field}>
          <label style={labelStyle}>Antall *</label>
          <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} placeholder="Antall" min={0} style={{ width: '100%' }} />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />

        <div style={field}><label style={labelStyle}>Navn</label><input value={name} onChange={e => setName(e.target.value)} placeholder="Navn" style={{ width: '100%' }} /></div>
        <div style={field}><label style={labelStyle}>Leverandør</label><input value={vendor} onChange={e => setVendor(e.target.value)} placeholder="Leverandør" style={{ width: '100%' }} /></div>
        <div style={field}><label style={labelStyle}>Lokasjon</label><input value={location} onChange={e => setLocation(e.target.value)} placeholder="Lokasjon" style={{ width: '100%' }} /></div>
        <div style={field}><label style={labelStyle}>Notater</label><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notater" rows={2} style={{ width: '100%', resize: 'vertical' }} /></div>

        {error && <div style={{ color: 'var(--red)', fontSize: 11, marginBottom: 12 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" className="btn-ghost" onClick={onClose}>Avbryt</button>
          <button type="submit" className="btn-primary" disabled={!partNumber || loading}>{loading ? '…' : 'Legg til'}</button>
        </div>
      </form>
    </div>
  );
}
