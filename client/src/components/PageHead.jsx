import { Link } from 'react-router-dom';
import Bilum from './Bilum';

export default function PageHead({ title, lead, links = [], label }) {
  return (
    <>
      <div className="pagehead">
        <div className="wrap">
          <h1>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {links.length > 0 && (
            <nav className="subnav" aria-label={label || `${title} sections`}>
              {links.map((l) => <Link key={l.to} to={l.to}>{l.label}</Link>)}
            </nav>
          )}
        </div>
      </div>
      <Bilum />
    </>
  );
}
