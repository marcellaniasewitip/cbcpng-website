import { useState } from 'react';
import { api, assetUrl } from '../api';

/** One form control, chosen by the field type from the server's resource definition. */
export default function FieldInput({ field, value, onChange, error, provinces = [], id }) {
  const common = {
    id, name: field.name,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': error ? `${id}-err` : undefined,
  };
  let control;
  switch (field.type) {
    case 'textarea':
      control = <textarea {...common} rows={field.rows || 5} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
      break;
    case 'boolean':
      return (
        <div className="field">
          <label className="check" htmlFor={id}>
            <input {...common} type="checkbox" checked={Number(value) === 1} onChange={(e) => onChange(e.target.checked ? 1 : 0)} />
            {field.label}
          </label>
        </div>
      );
    case 'select':
      control = (
        <select {...common} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          <option value="">Choose one</option>
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
      break;
    case 'province':
      control = (
        <select {...common} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          <option value="">Choose a province</option>
          {provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      );
      break;
    case 'image':
      control = <ImageInput {...common} value={value} onChange={onChange} />;
      break;
    case 'number':
      control = <input {...common} type="number" inputMode="numeric" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
      break;
    case 'date':
      control = <input {...common} type="date" value={value ? String(value).slice(0, 10) : ''} onChange={(e) => onChange(e.target.value)} />;
      break;
    case 'url':
      control = <input {...common} type="url" inputMode="url" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="https://" />;
      break;
    case 'email':
      control = <input {...common} type="email" inputMode="email" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
      break;
    default:
      control = <input {...common} type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  }
  return (
    <div className={`field${field.type === 'textarea' || field.type === 'image' ? ' full' : ''}`}>
      <label htmlFor={id}>{field.label}{field.required && <span aria-hidden="true"> *</span>}</label>
      {control}
      {error && <span className="error" id={`${id}-err`}>{error}</span>}
    </div>
  );
}

function ImageInput({ id, value, onChange, ...rest }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr('');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const r = await api('/admin/upload', { method: 'POST', body: fd, auth: true });
      onChange(r.url);
    } catch (ex) { setErr(ex.message); } finally { setBusy(false); e.target.value = ''; }
  }
  return (
    <div>
      <div className="image-field">
        {value && <img src={assetUrl(value)} alt="" />}
        <input id={id} {...rest} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onFile} disabled={busy} style={{ maxWidth: 320 }} />
        {value && <button type="button" className="btn danger small" onClick={() => onChange(null)}>Remove photo</button>}
      </div>
      {busy && <span className="hint">Uploading…</span>}
      {err && <span className="error">{err}</span>}
    </div>
  );
}
