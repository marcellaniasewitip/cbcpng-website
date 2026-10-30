import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Messages() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('unread');

  const load = () => api('/admin/messages', { auth: true }).then(setRows).catch((e) => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  async function setRead(m, isRead) {
    try {
      await api(`/admin/messages/${m.id}`, { method: 'PATCH', body: { is_read: isRead }, auth: true });
      setRows((rs) => rs.map((r) => (r.id === m.id ? { ...r, is_read: isRead ? 1 : 0 } : r)));
    } catch (e) { setError(e.message); }
  }
  async function remove(m) {
    if (!window.confirm(`Delete the message from ${m.full_name}? This cannot be undone.`)) return;
    try {
      await api(`/admin/messages/${m.id}`, { method: 'DELETE', auth: true });
      setRows((rs) => rs.filter((r) => r.id !== m.id));
    } catch (e) { setError(e.message); }
  }

  const shown = filter === 'unread' ? rows.filter((r) => !r.is_read) : rows;

  return (
    <>
      <div className="admin-head">
        <h1>Messages</h1>
        <div className="field" style={{ margin: 0, minWidth: 200 }}>
          <label htmlFor="msg-filter" className="sr-only">Show</label>
          <select id="msg-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="unread">Unread only</option>
            <option value="all">All messages</option>
          </select>
        </div>
      </div>
      {error && <div className="alert err" role="alert">{error}</div>}
      {loading ? <p>Loading…</p> : shown.length === 0 ? <p className="note">{filter === 'unread' ? 'No unread messages.' : 'No messages yet.'}</p> : shown.map((m) => (
        <article key={m.id} className={`card msg${m.is_read ? '' : ' unread'}`}>
          <h3>{m.subject}</h3>
          <div className="msg-meta">
            <b>{m.full_name}</b>
            {m.email && <> · <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}>{m.email}</a></>}
            {m.phone && <> · <a href={`tel:${m.phone.replace(/[^\d+]/g, '')}`}>{m.phone}</a></>}
            <br />{new Date(String(m.created_at).replace(' ', 'T')).toLocaleString('en-GB')}
          </div>
          <p>{m.message}</p>
          <div className="row-actions">
            {m.email && <a className="btn small" href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}>Reply by email</a>}
            <button type="button" className="btn small ghost" onClick={() => setRead(m, !m.is_read)}>{m.is_read ? 'Mark as unread' : 'Mark as read'}</button>
            <button type="button" className="btn small danger" onClick={() => remove(m)}>Delete</button>
          </div>
        </article>
      ))}
    </>
  );
}
