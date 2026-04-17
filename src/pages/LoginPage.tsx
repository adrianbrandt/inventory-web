// inventory-web/src/pages/LoginPage.tsx
import { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ukjent feil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
      <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '32px 36px', width: 320 }}>
        <div style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 13, letterSpacing: '0.08em', fontFamily: "'IBM Plex Mono', monospace", marginBottom: 4 }}>VARELAGER</div>
        <div style={{ color: 'var(--muted)', fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 28 }}>Logg inn</div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', color: 'var(--muted)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace", marginBottom: 5 }}>BRUKERNAVN</label>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="brukernavn" style={{ width: '100%' }} autoFocus />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', color: 'var(--muted)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace", marginBottom: 5 }}>PASSORD</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%' }} />
        </div>

        <button type="submit" className="btn-primary" disabled={loading || !username || !password} style={{ width: '100%' }}>
          {loading ? '…' : 'Logg inn'}
        </button>

        {error && <div style={{ marginTop: 12, color: 'var(--red)', fontSize: 11, textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace" }}>{error}</div>}
      </form>
    </div>
  );
}
