import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, referenceFor } from "../api";
import { useApp } from "../state.jsx";
import { ROLE } from "../roles.js";
import RangeBar from "../components/RangeBar.jsx";

const blank = { crop: "", quantity: "", quality: "A", location: "", price_per_kg: "" };

export default function PostListing() {
  const { user, prices, toast } = useApp();
  const t = ROLE[user.role];
  const nav = useNavigate();
  const [f, setF] = useState(blank);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const mandi = referenceFor(f.crop, prices);
  const price = parseFloat(f.price_per_kg);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api(`/${t.mine}`, { method: "POST", body: f });
      toast(t.published);
      nav("/app/mine");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page narrow">
      <h1>{t.postTitle}</h1>
      <p className="lede">{t.postHint}</p>
      <form className="card form" onSubmit={submit} noValidate>
        <label className="field">Crop
          <input value={f.crop} onChange={set("crop")} placeholder={t.cropPlaceholder} list="crops" required />
          <datalist id="crops">
            {[...new Set(prices.map((p) => p.commodity.replace(/\(.*\)/, "").trim()))].map((c) => <option key={c} value={c} />)}
          </datalist>
        </label>
        <div className="row">
          <label className="field">Quantity
            <input value={f.quantity} onChange={set("quantity")} placeholder="500 kg" required />
          </label>
          <label className="field">Quality grade
            <select value={f.quality} onChange={set("quality")}>
              <option value="A">A (best)</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </label>
        </div>
        <label className="field">Location
          <input value={f.location} onChange={set("location")} placeholder="Village or town, district" required />
        </label>
        <label className="field">{t.priceLabel}
          <input type="number" min="0" step="0.5" inputMode="decimal" value={f.price_per_kg} onChange={set("price_per_kg")} placeholder="18" required />
        </label>
        {mandi && (
          <div className="hint-box">
            <p>Mandi rate for {mandi.name.replace(/\(.*\)/, "").trim()}: average <strong>₹{mandi.modal.toFixed(2)}/kg</strong></p>
            {price > 0 && <RangeBar price={price} mandi={mandi} />}
          </div>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn primary big" disabled={busy}>{busy ? "Publishing…" : t.submit}</button>
      </form>
    </div>
  );
}
