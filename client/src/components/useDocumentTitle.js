import { useEffect } from 'react';

export default function useDocumentTitle(title) {
  useEffect(() => {
    const base = 'Christian Brethren Church of PNG';
    document.title = title ? `${title} | ${base}` : `${base} (CBC PNG)`;
  }, [title]);
}
