import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Logo from '../components/Logo';

export default function Login() {
  const { admin, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (admin) return <Navigate to={location.state?.from || '/admin'} replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try { await login(email, password); } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  return (
    <div className="login-wrap">
      <form className="card" onSubmit={onSubmit}>
        <div style={{ display: 'flex', gap: '.7rem', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ background: 'var(--green-deep)', borderRadius: 10, padding: 4, display: 'inline-flex' }}><Logo /></span>
          <div><b style={{ fontFamily: 'Alegreya, Georgia, serif', fontSize: '1.2rem' }}>CBC PNG website</b><br /><span className="note">Editor sign in</span></div>
        </div>
        {error && <div className="alert err" role="alert">{error}</div>}
        <div className="field">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="login-pass">Password</label>
          <input id="login-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn" type="submit" disabled={busy} style={{ width: '100%' }}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <p className="note" style={{ marginTop: '1rem' }}><a href="/">Back to the website</a></p>
      </form>
    </div>
  );
}
