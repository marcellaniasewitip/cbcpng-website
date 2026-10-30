import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import PageHead from '../components/PageHead';
import NewsCard from '../components/NewsCard';
import { ErrorState } from '../components/States';
import useDocumentTitle from '../components/useDocumentTitle';

const PER_PAGE = 9;

export default function News() {
  useDocumentTitle('News & Events');
  const [params] = useSearchParams();
  const page = Math.max(1, parseInt(params.get('page'), 10) || 1);
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    api(`/news?limit=${PER_PAGE}&page=${page}`, { signal: ctrl.signal })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((e) => e.name !== 'AbortError' && setState({ data: null, loading: false, error: e }));
    window.scrollTo(0, 0);
    return () => ctrl.abort();
  }, [page, attempt]);

  const { data, loading, error } = state;

  return (
    <>
      <PageHead title="News & Events" lead="Conventions, graduations, school and health updates, and prayer requests." />
      <section className="block">
        <div className="wrap">
          {error && <ErrorState error={error} onRetry={() => setAttempt((a) => a + 1)} />}
          {loading && <div className="news-grid">{[0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ aspectRatio: '4/3' }} />)}</div>}
          {!loading && data && (data.items.length === 0
            ? <p className="note">No news has been posted yet.</p>
            : (
              <>
                <div className="news-grid">{data.items.map((p) => <NewsCard key={p.id} post={p} />)}</div>
                {data.pages > 1 && (
                  <nav className="pager" aria-label="News pages">
                    {page > 1 ? <Link className="btn ghost small" to={`/news?page=${page - 1}`}>Newer stories</Link> : <span />}
                    <span className="note">Page {page} of {data.pages}</span>
                    {page < data.pages ? <Link className="btn ghost small" to={`/news?page=${page + 1}`}>Older stories</Link> : <span />}
                  </nav>
                )}
              </>
            ))}
        </div>
      </section>
    </>
  );
}
