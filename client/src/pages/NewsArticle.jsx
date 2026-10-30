import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import Bilum from '../components/Bilum';
import Photo from '../components/Photo';
import { Fill } from '../components/Fill';
import { PageSkeleton, ErrorState } from '../components/States';
import useDocumentTitle from '../components/useDocumentTitle';
import { formatDate, paragraphs } from '../utils';

export default function NewsArticle() {
  const { slug } = useParams();
  const [state, setState] = useState({ post: null, loading: true, error: null });
  useDocumentTitle(state.post?.title || 'News');

  useEffect(() => {
    const ctrl = new AbortController();
    setState({ post: null, loading: true, error: null });
    api(`/news/${encodeURIComponent(slug)}`, { signal: ctrl.signal })
      .then((post) => setState({ post, loading: false, error: null }))
      .catch((e) => e.name !== 'AbortError' && setState({ post: null, loading: false, error: e }));
    return () => ctrl.abort();
  }, [slug]);

  if (state.loading) return <PageSkeleton />;
  if (state.error) {
    return (
      <div className="wrap">
        <ErrorState error={state.error} />
        <p style={{ textAlign: 'center' }}><Link to="/news">Back to all news</Link></p>
      </div>
    );
  }
  const { post } = state;
  return (
    <>
      <div className="pagehead">
        <div className="wrap">
          <Link className="back-link" to="/news">All news</Link>
          <h1>{post.title}</h1>
          <p className="article-meta">
            <Fill value={post.published_at} hint="Date"><time dateTime={post.published_at}>{formatDate(post.published_at)}</time></Fill>
          </p>
        </div>
      </div>
      <Bilum />
      <section className="block">
        <div className="wrap">
          <article className="article">
            <p className="lead">{post.summary}</p>
            <Photo src={post.image_url} alt={post.image_alt} caption="Photo for this story" wide />
            <div className="article-body">
              {paragraphs(post.body).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
