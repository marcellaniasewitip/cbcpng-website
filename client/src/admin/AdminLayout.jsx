import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from './AuthContext';
import Logo from '../components/Logo';
import { PageSkeleton } from '../components/States';

export default function AdminLayout() {
  const { admin, checking, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [meta, setMeta] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!admin) return;
    api('/admin/meta', { auth: true }).then(setMeta).catch(() => {});
    api('/admin/summary', { auth: true }).then((s) => setUnread(s.messagesUnread)).catch(() => {});
  }, [admin, location.pathname]);
  useEffect(() => { document.title = 'Editor | CBC PNG'; }, []);

  if (checking) return <PageSkeleton />;
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;

  const groups = meta.reduce((acc, r) => { (acc[r.group] = acc[r.group] || []).push(r); return acc; }, {});
  const cls = ({ isActive }) => (isActive ? 'active' : undefined);

  return (
    <div className="admin">
      <div className="admin-top">
        <Link className="brand" to="/admin" style={{ color: 'inherit', textDecoration: 'none' }}><Logo /><span><b>CBC PNG editor</b></span></Link>
        <button type="button" className="menu-btn" aria-expanded={open} aria-controls="admin-side" onClick={() => setOpen((o) => !o)}>
          <span className="bars" aria-hidden="true" />Menu
        </button>
      </div>
      <aside id="admin-side" className={`admin-side${open ? ' open' : ''}`}>
        <Link className="brand" to="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>
          <Logo /><span><b>CBC PNG editor</b><small>{admin.name}</small></span>
        </Link>
        <nav aria-label="Editor">
          <NavLink to="/admin" end className={cls}>Overview</NavLink>
          <NavLink to="/admin/settings" className={cls}>Text &amp; contact details</NavLink>
          <NavLink to="/admin/messages" className={cls}>Messages{unread > 0 && <span className="badge">{unread}</span>}</NavLink>
          {Object.entries(groups).map(([g, items]) => (
            <div key={g}>
              <h4>{g}</h4>
              {items.map((r) => <NavLink key={r.key} to={`/admin/r/${r.key}`} className={cls}>{r.label}</NavLink>)}
            </div>
          ))}
          <h4>Account</h4>
          <NavLink to="/admin/password" className={cls}>Change password</NavLink>
          <a href="/" target="_blank" rel="noopener noreferrer">View website</a>
          <button type="button" className="linklike" onClick={logout}>Sign out</button>
        </nav>
      </aside>
      <div className="admin-main">
        <Outlet context={{ meta }} />
      </div>
    </div>
  );
}
