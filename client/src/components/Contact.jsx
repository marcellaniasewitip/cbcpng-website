import { Fill } from './Fill';
import { isBlank, telHref } from '../utils';

export function Phone({ value, hint = 'Phone' }) {
  if (isBlank(value)) return <Fill value={null} hint={hint} />;
  const href = telHref(value);
  return href ? <a href={href}>{value}</a> : <span>{value}</span>;
}

export function Email({ value, hint = 'Email' }) {
  if (isBlank(value)) return <Fill value={null} hint={hint} />;
  return <a href={`mailto:${value}`}>{value}</a>;
}
