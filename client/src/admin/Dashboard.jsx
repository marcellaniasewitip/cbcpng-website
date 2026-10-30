import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from './AuthContext';

export default function Dashboard() {
  const { admin } = useAuth();
  const [s, setS] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api('/admin/summary', { auth: true }).then(setS).catch((e) => setError(e.message)); }, []);

  return (
    <>
      <h1>Welcome, {admin.name.split(' ')[0]}</h1>
      <p className="lead">Fill in the details marked with dashed gold boxes on the website. Changes appear on the site within a minute.</p>
      {error && <div className="alert err">{error}</div>}
      {s && (
        <div className="admin-cards">
          <Link className="card" to="/admin/settings"><b>{s.settingsEmpty}</b>text and contact details still to fill in</Link>
          <Link className="card" to="/admin/messages"><b>{s.messagesUnread}</b>unread messages ({s.messagesTotal} total)</Link>
          <Link className="card" to="/admin/r/congregations"><b>{s.congregationsTotal}</b>congregations listed</Link>
          <Link className="card" to="/admin/r/news"><b>{s.newsTotal}</b>news stories</Link>
        </div>
      )}
      <h2>Before the site goes public</h2>
      <ul className="plain">
        <li>Confirm the vision, mission and values wording, then tick “officially approved” in <Link to="/admin/settings">Text &amp; contact details</Link>.</li>
        <li>Add the statement of faith word for word.</li>
        <li>Add every congregation with its province.</li>
        <li>Enter bank details and tick “approved by church finance” only after finance has signed off.</li>
        <li>Only list missionaries who have given permission to be shown publicly.</li>
        <li>Turn off the draft banner under General in <Link to="/admin/settings">Text &amp; contact details</Link>.</li>
      </ul>
    </>
  );
}
