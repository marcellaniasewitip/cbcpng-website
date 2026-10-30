import { Fill } from './Fill';

export default function Stats({ items = [], overrides = {} }) {
  if (!items.length) return null;
  return (
    <div className="stats">
      {items.map((s) => {
        const value = s.value ?? overrides[s.label];
        return (
          <div className="stat" key={s.id}>
            <Fill as="b" value={value} hint="000" />
            <span>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}
