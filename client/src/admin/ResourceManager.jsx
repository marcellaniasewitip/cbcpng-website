import { useEffect, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { api } from '../api';
import { useSite } from '../SiteContext';
import FieldInput from './FieldInput';
import { formatDate } from '../utils';

export default function ResourceManager() {
  const { resource } = useParams();
  const { meta } = useOutletContext();
  const def = meta.find((m) => m.key === resource);
  const { reload } = useSite();
  const [rows, setRows] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState(null); // {} for new, row for edit
  const [search, setSearch] = useState('');

  const usesProvince = def?.fields.some((f) => f.type === 'province');

  const load = () => {
    setLoading(true); setError('');
    api(`/admin/r/${resource}`, { auth: true })
      .then(setRows).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { setEditing(null); setNotice(''); setSearch(''); load(); }, [resource]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (usesProvince) api('/admin/r/provinces', { auth: true }).then(setProvinces).catch(() => {});
  }, [usesProvince]);

  const listFields = def ? def.fields.filter((f) => f.list) : [];
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => listFields.some((f) => String(display(f, r[f.name], provinces) ?? '').toLowerCase().includes(q)));
  }, [rows, search, listFields, provinces]);

  if (!def) return <p>Loading…</p>;

  async function remove(row) {
    const name = row[listFields[0]?.name] || 'this item';
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;
    try {
      await api(`/admin/r/${resource}/${row.id}`, { method: 'DELETE', auth: true });
      setNotice(`Deleted “${name}”.`); load(); reload();
    } catch (e) { setError(e.message); }
  }

  return (
    <>
      <div className="admin-head">
        <h1>{def.label}</h1>
        <button type="button" className="btn" onClick={() => setEditing({})}>Add new</button>
      </div>
      {notice && <div className="alert ok" role="status">{notice}</div>}
      {error && <div className="alert err" role="alert">{error}</div>}
      {rows.length > 8 && (
        <div className="field search-input">
          <label htmlFor="r-search">Search this list</label>
          <input id="r-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      )}
      <div className="tablewrap stack">
        <table>
          <thead><tr>{listFields.map((f) => <th key={f.name}>{shortLabel(f.label)}</th>)}<th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {loading ? <tr><td className="empty" colSpan={listFields.length + 1}>Loading…</td></tr>
              : filtered.length === 0 ? <tr><td className="empty" colSpan={listFields.length + 1}>{search ? 'Nothing matches your search.' : 'Nothing here yet. Use the Add button to create the first one.'}</td></tr>
                : filtered.map((r) => (
                  <tr key={r.id}>
                    {listFields.map((f) => (
                      <td key={f.name} data-label={shortLabel(f.label)}>
                        {display(f, r[f.name], provinces) ?? <span className="fill">to fill in</span>}
                      </td>
                    ))}
                    <td data-label="">
                      <div className="row-actions">
                        <button type="button" className="btn small ghost" onClick={() => setEditing(r)}>Edit</button>
                        <button type="button" className="btn small danger" onClick={() => remove(r)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <EditDialog
          def={def} resource={resource} row={editing} provinces={provinces}
          onClose={() => setEditing(null)}
          onSaved={(msg) => { setEditing(null); setNotice(msg); load(); reload(); }}
        />
      )}
    </>
  );
}

function EditDialog({ def, resource, row, provinces, onClose, onSaved }) {
  const isNew = !row.id;
  const [values, setValues] = useState(() => Object.fromEntries(def.fields.map((f) => [f.name, row[f.name] ?? f.default ?? (f.type === 'boolean' ? 0 : '')])));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true); setFormError(''); setErrors({});
    try {
      await api(isNew ? `/admin/r/${resource}` : `/admin/r/${resource}/${row.id}`, { method: isNew ? 'POST' : 'PUT', body: values, auth: true });
      onSaved(isNew ? 'Added.' : 'Saved.');
    } catch (err) {
      setErrors(err.fields || {}); setFormError(err.message);
    } finally { setBusy(false); }
  }

  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" role="dialog" aria-modal="true" aria-labelledby="edit-title" onSubmit={onSubmit} noValidate>
        <h2 id="edit-title">{isNew ? 'Add new' : 'Edit'}: {def.label}</h2>
        {formError && <div className="alert err" role="alert">{formError}</div>}
        <div className="form-grid">
          {def.fields.map((f) => (
            <FieldInput
              key={f.name} field={f} id={`f-${f.name}`} value={values[f.name]} error={errors[f.name]} provinces={provinces}
              onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))}
            />
          ))}
        </div>
        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn" disabled={busy}>{busy ? 'Saving…' : isNew ? 'Add' : 'Save changes'}</button>
        </div>
      </form>
    </div>
  );
}

function display(field, value, provinces) {
  if (value === null || value === undefined || value === '') return field.type === 'boolean' ? 'No' : null;
  if (field.type === 'boolean') return Number(value) === 1 ? 'Yes' : 'No';
  if (field.type === 'date') return formatDate(value);
  if (field.type === 'province') return provinces.find((p) => p.id === Number(value))?.name || `#${value}`;
  if (field.type === 'select') return field.options.find((o) => o.value === value)?.label || value;
  return String(value);
}
const shortLabel = (l) => l.replace(/\s*\(.*\)\s*$/, '');
