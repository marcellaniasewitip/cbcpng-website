export function PageSkeleton() {
  return (
    <div className="wrap" style={{ padding: '3rem var(--gutter)' }} aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="skeleton" style={{ height: '2.6rem', maxWidth: 420, marginBottom: '1rem' }} />
      <div className="skeleton" style={{ height: '1.1rem', maxWidth: 640, marginBottom: '.6rem' }} />
      <div className="skeleton" style={{ height: '1.1rem', maxWidth: 560, marginBottom: '2rem' }} />
      <div className="skeleton" style={{ height: 220 }} />
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="state-box" role="alert">
      <h2>This page could not load</h2>
      <p>{error?.message || 'The website could not reach its server.'}</p>
      {onRetry && <button type="button" className="btn" onClick={onRetry}>Try again</button>}
    </div>
  );
}
