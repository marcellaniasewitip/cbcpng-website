import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { useSite } from '../SiteContext';
import FieldInput from './FieldInput';

export default function SettingsEditor() {
  const { reload } = useSite();
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState({});
  const [initial, setInitial] = useState({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({ type: null, text: '' });

  useEffect(() => {
    api('/admin/settings', { auth: true })
      .then((r) => {
        setRows(r);
        const v = Object.fromEntries(r.map((x) => [x.setting_key, x.setting_value ?? '']));
        setValues(v); setInitial(v);
      })
      .catch((e) => setStatus({ type: 'err', text: e.message }))
      .finally(() => setLoading(false));
  }, []);

  const groups = useMemo(() => rows.reduce((acc, r) => { (acc[r.group_name] = acc[r.group_name] || []).push(r); return acc; }, {}), [rows]);
  const changed = Object.keys(values).filter((k) => String(values[k] ?? '') !== String(initial[k] ?? ''));

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!changed.length) return undefined;
    const h = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [changed.length]);

  async function save(e) {
    e.preventDefault();
    setBusy(true); setStatus({ type: null, text: '' });
    try {
      const body = Object.fromEntries(changed.map((k) => [k, values[k]]));
      await api('/admin/settings', { method: 'PUT', body, auth: true });
      setInitial(values);
      setStatus({ type: 'ok', text: `Saved ${changed.length} change${changed.length === 1 ? '' : 's'}.` });
      reload();
    } catch (err) { setStatus({ type: 'err', text: err.message }); } finally { setBusy(false); }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <form onSubmit={save}>
      <h1>Text &amp; contact details</h1>
      <p className="lead">Anything left empty shows on the website as a dashed gold “to be confirmed” box.</p>
      {Object.entries(groups).map(([g, items], gi) => {
        const empty = items.filter((r) => r.input_type !== 'boolean' && String(values[r.setting_key] ?? '').trim() === '').length;
        return (
          <details className="settings-group card" key={g} open={gi === 0}>
            <summary>{g}{empty > 0 && <span className="empty-count">{empty} to fill in</span>}</summary>
            <div className="form-grid">
              {items.map((r) => (
                <FieldInput
                  key={r.setting_key}
                  id={`s-${r.setting_key}`}
                  field={{ name: r.setting_key, label: r.label, type: r.input_type === 'number' ? 'text' : r.input_type, rows: 6 }}
                  value={r.input_type === 'boolean' ? (values[r.setting_key] === '1' ? 1 : 0) : values[r.setting_key]}
                  onChange={(v) => setValues((s) => ({ ...s, [r.setting_key]: r.input_type === 'boolean' ? (v ? '1' : '0') : v }))}
                />
              ))}
            </div>
          </details>
        );
      })}
      <div className="sticky-save">
        <button type="submit" className="btn" disabled={busy || !changed.length}>{busy ? 'Saving…' : 'Save changes'}</button>
        <span className="note" role="status">
          {status.text ? <span className={status.type === 'err' ? 'error' : undefined}>{status.text}</span>
            : changed.length ? `${changed.length} unsaved change${changed.length === 1 ? '' : 's'}` : 'All changes saved'}
        </span>
      </div>
    </form>
  );
}
