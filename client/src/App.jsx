import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { PageSkeleton } from './components/States';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Publication from './pages/Publication';
import News from './pages/News';
import NewsArticle from './pages/NewsArticle';
import Contact from './pages/Contact';
import Give from './pages/Give';
import NotFound from './pages/NotFound';

// The editor is loaded only when someone opens /admin, keeping the public site fast on mobile data.
const AdminApp = lazy(() => import('./admin/AdminApp'));

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Suspense fallback={<PageSkeleton />}><AdminApp /></Suspense>} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="publication" element={<Publication />} />
        <Route path="news" element={<News />} />
        <Route path="news/:slug" element={<NewsArticle />} />
        <Route path="contact" element={<Contact />} />
        <Route path="give" element={<Give />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
