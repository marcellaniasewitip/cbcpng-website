import { assetUrl } from '../api';

/** A real photo when uploaded, otherwise the striped placeholder from the draft. */
export default function Photo({ src, alt, caption, round = false, wide = false, className = '', style }) {
  const cls = ['photo', round && 'round', wide && 'wide', src && 'has-img', className].filter(Boolean).join(' ');
  if (src) {
    return (
      <div className={cls} style={style}>
        <img src={assetUrl(src)} alt={alt || caption || ''} loading="lazy" decoding="async" />
      </div>
    );
  }
  return <div className={cls} style={style} role="img" aria-label={`Photo to come: ${caption || alt || 'photo'}`}>{caption || 'Photo'}</div>;
}
