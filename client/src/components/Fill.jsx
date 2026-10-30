import { isBlank, paragraphs } from '../utils';

/**
 * Shows a value, or — while it is still empty in the database —
 * a dashed gold "to be confirmed" box with a hint, exactly like the draft.
 */
export function Fill({ value, hint, as: Tag = 'span', className = '', children }) {
  if (isBlank(value)) return <Tag className={`fill ${className}`.trim()} title="To be confirmed by CBC PNG leaders">{hint}</Tag>;
  return <Tag className={className || undefined}>{children ?? value}</Tag>;
}

/** Multi-paragraph text. Shows a dashed block while empty or still unconfirmed. */
export function FillBlock({ value, hint, draft = false, draftLabel = 'Draft to confirm: ' }) {
  if (isBlank(value)) return <div className="fill-block"><p>{hint}</p></div>;
  const paras = paragraphs(value);
  if (draft) {
    return (
      <div className="fill-block">
        {paras.map((p, i) => <p key={i}>{i === 0 ? draftLabel : ''}{p}</p>)}
      </div>
    );
  }
  return <div className="prose-block">{paras.map((p, i) => <p key={i}>{p}</p>)}</div>;
}
