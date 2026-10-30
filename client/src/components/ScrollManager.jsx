import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSite } from '../SiteContext';

/**
 * Scrolls to the top on a new page, or to the section named in the hash
 * (e.g. /about#youth) once that section has rendered.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  const { loading } = useSite();

  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return undefined; }
    let tries = 0;
    let frame;
    const id = decodeURIComponent(hash.slice(1));
    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: 'start' });
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      } else if (tries++ < 60) {
        frame = requestAnimationFrame(attempt);
      }
    };
    attempt();
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, loading]);

  return null;
}
