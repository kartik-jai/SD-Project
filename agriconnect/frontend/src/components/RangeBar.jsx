import { rupee } from "../api";
import { useApp } from "../state.jsx";

/** Shows where a listing's price sits inside today's mandi min–max range. */
export default function RangeBar({ price, mandi: r }) {
  const { t } = useApp();

  if (!r) return <p className="range-none">{t("no_mandi_for_crop")}</p>;

  const lo = Math.min(r.min, price) * 0.9;
  const hi = Math.max(r.max, price) * 1.1;
  const pos = (v) => `${((v - lo) / (hi - lo)) * 100}%`;
  const diff = Math.round(((price - r.modal) / r.modal) * 100);

  const text =
    diff === 0
      ? t("at_mandi_avg")
      : `${Math.abs(diff)}${t(diff > 0 ? "above_mandi_avg" : "below_mandi_avg")}`;

  return (
    <div className="range" aria-label={`${text}. ${t("mandi_range_prefix")} ${rupee(r.min)} to ${rupee(r.max)}`}>
      <div className="range-track">
        <span className="range-band" style={{ left: pos(r.min), width: `calc(${pos(r.max)} - ${pos(r.min)})` }} />
        <span className="range-modal" style={{ left: pos(r.modal) }} />
        <span className="range-dot" style={{ left: pos(price) }} />
      </div>
      <p>
        <strong>{text}</strong>
        <span>
          {t("mandi_range_prefix")} {rupee(r.min)}–{rupee(r.max)}{t("per_kg")}
        </span>
      </p>
    </div>
  );
}
