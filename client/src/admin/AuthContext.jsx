import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, tokenStore } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(Boolean(tokenStore.get()));

  useEffect(() => {
    if (!tokenStore.get()) return;
    api('/admin/auth/me', { auth: true })
      .then((r) => setAdmin(r.admin))
      .catch(() => setAdmin(null))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    const onOut = () => setAdmin(null);
    window.addEventListener('cbcpng:signed-out', onOut);
    return () => window.removeEventListener('cbcpng:signed-out', onOut);
  }, []);

  const login = useCallback(async (email, password) => {
    const r = await api('/admin/auth/login', { method: 'POST', body: { email, password } });
    tokenStore.set(r.token);
    setAdmin(r.admin);
  }, []);

  const logout = useCallback(() => { tokenStore.clear(); setAdmin(null); }, []);

  return <AuthContext.Provider value={{ admin, checking, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
