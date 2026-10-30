import { useState } from 'react';
import { api } from '../api';

export default function ChangePassword() {
  const [f, setF] = useState({ current_password: '', new_password: '', confirm: '' });
  const [status, setStatus] = useState({ type: null, text: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    if (f.new_password !== f.confirm) { setStatus({ type: 'err', text: 'The two new passwords do not match.' }); return; }
    setBusy(true); setStatus({ type: null, text: '' });
    try {
      await api('/admin/auth/password', { method: 'POST', body: f, auth: true });
      setF({ current_password: '', new_password: '', confirm: '' });
      setStatus({ type: 'ok', text: 'Password changed.' });
    } catch (err) { setStatus({ type: 'err', text: err.message }); } finally { setBusy(false); }
  }

  return (
    <form className="card" style={{ maxWidth: 480 }} onSubmit={onSubmit}>
      <h1>Change password</h1>
      {status.text && <div className={`alert ${status.type}`} role="status">{status.text}</div>}
      <div className="field"><label htmlFor="cp-cur">Current password</label><input id="cp-cur" type="password" autoComplete="current-password" value={f.current_password} onChange={set('current_password')} required /></div>
      <div className="field"><label htmlFor="cp-new">New password</label><input id="cp-new" type="password" autoComplete="new-password" minLength={10} value={f.new_password} onChange={set('new_password')} required /><span className="hint">At least 10 characters.</span></div>
      <div className="field"><label htmlFor="cp-conf">Type the new password again</label><input id="cp-conf" type="password" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} required /></div>
      <button className="btn" type="submit" disabled={busy}>{busy ? 'Changing…' : 'Change password'}</button>
    </form>
  );
}
