import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useSite } from '../SiteContext';
import Bilum from '../components/Bilum';
import Photo from '../components/Photo';
import Stats from '../components/Stats';
import NewsCard from '../components/NewsCard';
import { Fill } from '../components/Fill';
import useDocumentTitle from '../components/useDocumentTitle';

export default function Home() {
  useDocumentTitle(null);
  const { data } = useSite();
  const s = data.settings;
  const hero = data.gallery.hero?.[0];
  const [news, setNews] = useState({ items: [], loading: true, error: null });

  useEffect(() => {
    const ctrl = new AbortController();
    api('/news?limit=3', { signal: ctrl.signal })
      .then((r) => setNews({ items: r.items, loading: false, error: null }))
      .catch((e) => e.name !== 'AbortError' && setNews({ items: [], loading: false, error: e }));
    return () => ctrl.abort();
  }, []);

  // Fill obvious numbers automatically when leaders have not typed them in
  const overrides = {
    congregations: data.congregationCount > 0 ? data.congregationCount : null,
    provinces: s.province_count,
  };

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <p className="tp">{s.hero_greeting}</p>
            <h1>{s.hero_title}</h1>
            <p>
              The Christian Brethren Church of Papua New Guinea (CBC PNG) is a national fellowship of
              Bible-centred local churches in <Fill value={s.province_count} hint="number" /> provinces.
              Since <Fill value={s.founded_year} hint="year" /> we have shared the love of Jesus Christ through
              our churches, schools, training institutes, health services and Christian publishing.
            </p>
            <div className="btns">
              <Link className="btn" to="/about#church">Find a church near you</Link>
              <Link className="btn ghost" to="/about#vision">What we believe</Link>
            </div>
          </div>
          <Photo src={hero?.image_url} caption={hero ? `Photo: ${hero.caption}` : 'Photo: a CBC congregation worshipping together'} alt={hero?.caption} />
        </div>
      </section>
      <Bilum />

      <section className="block">
        <div className="wrap">
          <h2>CBC PNG at a glance</h2>
          <Stats items={data.stats.home || []} overrides={overrides} />
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <h2>Our ministries</h2>
          <div className="tiles">
            {data.ministries.map((m) => (
              <Link className="tile" to={m.link} key={m.id}>
                <Photo src={m.image_url} alt={m.image_alt} caption={`Photo: ${m.image_alt || m.title}`} />
                <h3>{m.title}</h3>
                <p>{m.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <h2>Latest news</h2>
          {news.loading && <div className="news-grid">{[0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ aspectRatio: '4/3' }} />)}</div>}
          {news.error && <p className="note">News could not load right now. <Link to="/news">Open the news page</Link>.</p>}
          {!news.loading && !news.error && (
            news.items.length
              ? <div className="news-grid">{news.items.map((p) => <NewsCard key={p.id} post={p} />)}</div>
              : <p className="note">No news has been posted yet.</p>
          )}
          <p className="mt"><Link to="/news">See all news and events</Link></p>
        </div>
      </section>
    </>
  );
}
