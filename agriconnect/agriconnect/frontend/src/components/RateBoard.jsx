import { rupee } from "../api";

/** The bhav board: real mandi rates in a slate panel. */
export default function RateBoard({ rows, limit = 6, title = "Mandi rates today" }) {
  const shown = rows.slice(0, limit);
  const date = rows[0]?.date;
  return (
    <section className="board" aria-label={title}>
      <header>
        <h2>{title}</h2>
        {date && <span>{date}</span>}
      </header>
      {shown.length === 0 ? (
        <p className="board-empty">No rates loaded. Put prices.csv in the backend folder.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Crop</th>
              <th scope="col">Market</th>
              <th scope="col" className="num">Low</th>
              <th scope="col" className="num">High</th>
              <th scope="col" className="num">Average</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r, i) => (
              <tr key={i}>
                <th scope="row">{r.commodity.replace(/\(.*\)/, "").trim()}</th>
                <td>{r.market.replace(/ APMC$/i, "")}, {r.state}</td>
                <td className="num">{rupee(r.min)}</td>
                <td className="num">{rupee(r.max)}</td>
                <td className="num avg">{rupee(r.modal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <footer>₹ per kg · Source: Agmarknet, data.gov.in</footer>
    </section>
  );
}
