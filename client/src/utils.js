export const isBlank = (v) => v === null || v === undefined || String(v).trim() === '';

export function formatDate(iso, opts = { day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!iso) return null;
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { ...opts, timeZone: 'UTC' });
}

export function formatNumber(n) {
  if (isBlank(n)) return null;
  const num = Number(n);
  return Number.isFinite(num) ? num.toLocaleString('en-GB') : String(n);
}

/** Split multi-line admin text into paragraphs. */
export const paragraphs = (text) => String(text || '').split(/\n\s*\n|\r\n\s*\r\n/).map((p) => p.trim()).filter(Boolean);
export const lines = (text) => String(text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

export function telHref(phone) {
  const digits = String(phone || '').replace(/[^\d+]/g, '');
  return digits.length >= 6 ? `tel:${digits}` : null;
}
