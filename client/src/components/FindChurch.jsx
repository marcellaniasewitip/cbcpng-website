import { useEffect, useId, useState } from 'react';
import { api } from '../api';
import DataTable from './DataTable';
import { Phone } from './Contact';

export default function FindChurch({ provinces }) {
  const [province, setProvince] = useState('');
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [state, setState] = useState({ rows: [], loading: true, error: null });
  const ids = { prov: useId(), q: useId() };

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const ctrl = new AbortController();
    const params = new URLSearchParams();
    if (province) params.set('province_id', province);
    if (debounced) params.set('q', debounced);
    setState((s) => ({ ...s, loading: true }));
    api(`/congregations?${params}`, { signal: ctrl.signal })
      .then((rows) => setState({ rows, loading: false, error: null }))
      .catch((e) => e.name !== 'AbortError' && setState({ rows: [], loading: false, error: e }));
    return () => ctrl.abort();
  }, [province, debounced]);

  const provName = provinces.find((p) => String(p.id) === province)?.name;
  const empty = debounced
    ? `No congregation matches “${debounced}”${provName ? ` in ${provName}` : ''}.`
    : provName
      ? `Add CBC congregations in ${provName} to this list.`
      : 'Add every CBC congregation to this list: name, province, town, contact person, phone and service time.';

  return (
    <>
      <div className="tools">
        <div className="field">
          <label htmlFor={ids.prov}>Province</label>
          <select id={ids.prov} value={province} onChange={(e) => setProvince(e.target.value)}>
            <option value="">All provinces</option>
            {provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor={ids.q}>Congregation or town</label>
          <input id={ids.q} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Gordons" autoComplete="off" />
        </div>
      </div>
      <p className="result-count" aria-live="polite">
        {state.loading ? 'Searching…' : state.error ? state.error.message : `${state.rows.length} congregation${state.rows.length === 1 ? '' : 's'} found`}
      </p>
      <DataTable
        caption="CBC congregations"
        empty={empty}
        rows={state.loading ? [] : state.rows}
        columns={[
          { key: 'name', label: 'Congregation' },
          { key: 'province', label: 'Province' },
          { key: 'town', label: 'Town / village' },
          { key: 'contact_person', label: 'Contact person' },
          { key: 'phone', label: 'Phone', render: (r) => <Phone value={r.phone} /> },
          { key: 'service_time', label: 'Sunday service' },
        ]}
      />
    </>
  );
}
