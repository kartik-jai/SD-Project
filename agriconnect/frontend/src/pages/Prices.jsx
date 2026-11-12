import { useMemo, useState } from "react";
import { useApp } from "../state.jsx";
import { translateCrop, translateMarket, translateState } from "../i18n";
import RateBoard from "../components/RateBoard.jsx";

export default function Prices() {
  const { prices, t, lang } = useApp();
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return prices;

    return prices.filter((p) => {
      const orig = `${p.commodity} ${p.market} ${p.state} ${p.district}`.toLowerCase();
      const localized = `${translateCrop(p.commodity, lang)} ${translateMarket(p.market, lang)} ${translateState(p.state, lang)}`.toLowerCase();
      return orig.includes(term) || localized.includes(term);
    });
  }, [prices, q, lang]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{t("mandi_rates")}</h1>
          <p className="lede">{t("mandi_rates_sub")}</p>
        </div>
        <input
          className="search"
          type="search"
          placeholder={t("search_rates_placeholder")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label={t("search_rates_placeholder")}
        />
      </div>

      {prices.length === 0 ? (
        <div className="state">
          <p>{t("no_rates_loaded")}</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="state">
          <p>{t("nothing_matches", { q })}</p>
        </div>
      ) : (
        <RateBoard rows={rows} limit={500} title={`${rows.length} ${t("rates_count_label")}`} />
      )}
    </div>
  );
}
