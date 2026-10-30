import { Fill } from './Fill';

/**
 * Responsive table. On phones (< 720px) each row becomes a card with labels
 * (via the .stack class), so nothing ever scrolls sideways.
 *
 * columns: [{ key, label, render?(row), hint? }]
 */
export default function DataTable({ columns, rows, empty, caption, stack = true }) {
  return (
    <div className={`tablewrap${stack ? ' stack' : ''}`}>
      <table>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>{columns.map((c) => <th key={c.key} scope="col">{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} className="empty"><span className="fill">{empty}</span></td></tr>
          ) : rows.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map((c) => (
                <td key={c.key} data-label={c.label}>
                  {c.render ? c.render(row) : <Fill value={row[c.key]} hint={c.hint || c.label} />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
