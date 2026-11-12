import { rupee } from "../api";

/** Shows where a listing's price sits inside today's mandi min–max range. */
export default function RangeBar({ price, mandi: r }) {
  if (!r) return <p className="range-none">No mandi rate for this crop in your price data.</p>;
  const lo = Math.min(r.min, price) * 0.9;
  const hi = Math.max(r.max, price) * 1.1;
  const pos = (v) => `${((v - lo) / (hi - lo)) * 100}%`;
  const diff = Math.round(((price - r.modal) / r.modal) * 100);
  const text = diff === 0 ? "At the mandi average" : `${Math.abs(diff)}% ${diff > 0 ? "above" : "below"} the mandi average`;
  return (
    <div className="range" aria-label={`${text}. Mandi range ${rupee(r.min)} to ${rupee(r.max)} per kg.`}>
      <div className="range-track">
        <span className="range-band" style={{ left: pos(r.min), width: `calc(${pos(r.max)} - ${pos(r.min)})` }} />
        <span className="range-modal" style={{ left: pos(r.modal) }} />
        <span className="range-dot" style={{ left: pos(price) }} />
      </div>
      <p>
        <strong>{text}</strong>
        <span>
          Mandi {rupee(r.min)}–{rupee(r.max)}/kg
        </span>
      </p>
    </div>
  );
}
