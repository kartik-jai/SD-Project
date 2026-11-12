import { rupee } from "../api";
import { useApp } from "../state.jsx";
import { translateCrop, translateMarket, translateState } from "../i18n";

/** The bhav board: real mandi rates in a slate panel. */
export default function RateBoard({ rows, limit = 6, title }) {
  const { t, lang } = useApp();
  const boardTitle = title || t("mandi_rates_today");
  const shown = rows.slice(0, limit);

  // Determine latest arrival date reported in the dataset
  const parseDate = (dStr) => {
    if (!dStr) return 0;
    const parts = dStr.split("/");
    if (parts.length === 3) {
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime() || 0;
    }
    return new Date(dStr).getTime() || 0;
  };

  const itemsForDate = shown.length > 0 ? shown : rows;
  const latestDate = itemsForDate.reduce((best, r) => {
    if (!r.date) return best;
    return parseDate(r.date) > parseDate(best) ? r.date : best;
  }, itemsForDate[0]?.date || "");

  return (
    <section className="board" aria-label={boardTitle}>
      <header>
        <h2>{boardTitle}</h2>
        {latestDate && <span>{t("as_of", { date: latestDate })}</span>}
      </header>
      {shown.length === 0 ? (
        <p className="board-empty">{t("no_rates_loaded")}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">{t("th_crop")}</th>
              <th scope="col">{t("th_market")}</th>
              <th scope="col" className="num">{t("th_low")}</th>
              <th scope="col" className="num">{t("th_high")}</th>
              <th scope="col" className="num">{t("th_avg")}</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r, i) => (
              <tr key={i}>
                <th scope="row">{translateCrop(r.commodity, lang)}</th>
                <td>
                  {translateMarket(r.market, lang)}, {translateState(r.state, lang)}
                </td>
                <td className="num">{rupee(r.min)}</td>
                <td className="num">{rupee(r.max)}</td>
                <td className="num avg">{rupee(r.modal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <footer>{t("per_kg_source")}</footer>
    </section>
  );
}
