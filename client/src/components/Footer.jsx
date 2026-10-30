import { Link } from 'react-router-dom';
import Bilum from './Bilum';
import { Fill } from './Fill';
import { Phone, Email } from './Contact';
import { useSettings } from '../SiteContext';

export default function Footer() {
  const s = useSettings();
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <Bilum />
      <div className="wrap">
        <div className="dark-fill">
          <h3>{s.site_name || 'Christian Brethren Church of Papua New Guinea'}</h3>
          <p>
            <Fill value={s.office_address} hint="Head office address" /><br />
            <Phone value={s.office_phone} /> · <Email value={s.office_email} />
          </p>
          {s.facebook_url && (
            <p><a href={s.facebook_url} target="_blank" rel="noopener noreferrer">Join us on Facebook</a></p>
          )}
        </div>
        <div>
          <h3>About</h3>
          <ul>
            <li><Link to="/about#vision">Vision &amp; Mission</Link></li>
            <li><Link to="/about#church">Find a church</Link></li>
            <li><Link to="/about#youth">Youth</Link></li>
            <li><Link to="/about#history">History</Link></li>
          </ul>
        </div>
        <div>
          <h3>Services</h3>
          <ul>
            <li><Link to="/services#training">Training</Link></li>
            <li><Link to="/services#education">Education</Link></li>
            <li><Link to="/services#health">Health</Link></li>
            <li><Link to="/publication#bookshops">Bookshops</Link></li>
          </ul>
        </div>
      </div>
      <div className="copy">© {year} {s.site_name || 'Christian Brethren Church of Papua New Guinea'}</div>
    </footer>
  );
}
