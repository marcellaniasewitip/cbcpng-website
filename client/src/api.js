const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'cbcpng_admin_token';

export const tokenStore = {
  get: () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } },
  set: (t) => { try { localStorage.setItem(TOKEN_KEY, t); } catch { /* private mode */ } },
  clear: () => { try { localStorage.removeItem(TOKEN_KEY); } catch { /* private mode */ } },
};

export class ApiError extends Error {
  constructor(message, status, fields) {
    super(message);
    this.status = status;
    this.fields = fields || {};
  }
}

export async function api(path, { method = 'GET', body, auth = false, signal } = {}) {
  const headers = {};
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body && !isForm) headers['Content-Type'] = 'application/json';
  if (auth) {
    const t = tokenStore.get();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method, headers, signal,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('Cannot reach the server. Check your internet connection and try again.', 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && auth) {
      tokenStore.clear();
      window.dispatchEvent(new Event('cbcpng:signed-out'));
    }
    throw new ApiError(data.error || `Request failed (${res.status}).`, res.status, data.fields);
  }
  return data;
}

/** Turn "/uploads/x.jpg" into a full URL when the API is on another domain. */
export function assetUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${BASE}${url}`;
}
