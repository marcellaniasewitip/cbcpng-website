import { Link } from 'react-router-dom';
import useDocumentTitle from '../components/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <div className="state-box">
      <h1 style={{ color: 'var(--green)' }}>Page not found</h1>
      <p>The page you followed may have moved. Use the menu above, or go back to the home page.</p>
      <Link className="btn" to="/">Go to home page</Link>
    </div>
  );
}
