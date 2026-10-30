import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';

export const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Training & Services' },
  { to: '/publication', label: 'Publication' },
  { to: '/news', label: 'News' },
  { to: '/contact', label: 'Contact' },
  { to: '/give', label: 'Give' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const headerRef = useRef(null);

  // Close the menu on navigation, Escape, or a tap outside it
  useEffect(() => { setOpen(false); }, [location.pathname, location.hash]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onClick = (e) => { if (headerRef.current && !headerRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onClick); };
  }, [open]);
  // Close if the window grows to desktop width while open
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="bar">
        <Link className="brand" to="/" aria-label="CBC PNG home">
          <Logo />
          <span><b>Christian Brethren Church</b><small>of Papua New Guinea</small></span>
        </Link>
        <button
          type="button" className="menu-btn" aria-expanded={open} aria-controls="mainnav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="bars" aria-hidden="true" />
          Menu
        </button>
        <nav className={`main-nav${open ? ' open' : ''}`} id="mainnav" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
