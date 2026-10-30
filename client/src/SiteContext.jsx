import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from './api';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const load = useCallback(() => {
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    api('/site', { signal: ctrl.signal })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => { if (err.name !== 'AbortError') setState({ data: null, loading: false, error: err }); });
    return () => ctrl.abort();
  }, []);

  useEffect(() => load(), [load]);

  return <SiteContext.Provider value={{ ...state, reload: load }}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside <SiteProvider>');
  return ctx;
}

/** Shorthand for settings with an empty-object fallback while loading. */
export function useSettings() {
  return useSite().data?.settings || {};
}
