import { Link } from 'react-router-dom';
import Photo from './Photo';
import { Fill } from './Fill';
import { formatDate } from '../utils';

export default function NewsCard({ post }) {
  const to = `/news/${post.slug}`;
  return (
    <article className="news-card">
      <Link to={to} tabIndex={-1} aria-hidden="true">
        <Photo src={post.image_url} alt={post.image_alt} caption="Photo for this story" />
      </Link>
      <h3><Link to={to}>{post.title}</Link></h3>
      <Fill value={post.published_at} hint="Date">
        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
      </Fill>
      <p>{post.summary}</p>
    </article>
  );
}
