import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollManager from './ScrollManager';
import { PageSkeleton, ErrorState } from './States';
import { useSite } from '../SiteContext';

export default function Layout() {
  const { data, loading, error, reload } = useSite();
  const { pathname } = useLocation();
  const s = data?.settings || {};
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      {s.show_draft_notice === '1' && s.draft_notice && (
        <div className="draft" role="note">{s.draft_notice}</div>
      )}
      <Header />
      <ScrollManager />
      <main id="main" tabIndex={-1}>
        {loading && !data ? <PageSkeleton />
          : error ? <ErrorState error={error} onRetry={reload} />
            : <div className="page-enter" key={pathname}><Outlet /></div>}
      </main>
      <Footer />
    </>
  );
}
