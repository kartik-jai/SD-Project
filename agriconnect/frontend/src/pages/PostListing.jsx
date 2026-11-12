import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, referenceFor } from "../api";
import { useApp } from "../state.jsx";
import { getRoleConfig } from "../roles.js";
import { translateCrop } from "../i18n";
import RangeBar from "../components/RangeBar.jsx";

const blank = { crop: "", quantity: "", quality: "A", location: "", price_per_kg: "" };

export default function PostListing() {
  const { user, prices, toast, lang, t } = useApp();
  const roleCfg = getRoleConfig(user.role, lang);
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
      await api(`/${roleCfg.mine}`, { method: "POST", body: f });
      toast(roleCfg.published);
      nav("/app/mine");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page narrow">
      <h1>{roleCfg.postTitle}</h1>
      <p className="lede">{roleCfg.postHint}</p>

      <form className="card form" onSubmit={submit} noValidate>
        <label className="field">
          {t("field_crop")}
          <input
            value={f.crop}
            onChange={set("crop")}
            placeholder={roleCfg.cropPlaceholder}
            list="crops"
            required
          />
          <datalist id="crops">
            {[...new Set(prices.map((p) => p.commodity.replace(/\(.*\)/, "").trim()))].map((c) => (
              <option key={c} value={c}>
                {lang !== "en" ? `${translateCrop(c, lang)} (${c})` : c}
              </option>
            ))}
          </datalist>
        </label>

        <div className="row">
          <label className="field">
            {t("field_quantity")}
            <input
              value={f.quantity}
              onChange={set("quantity")}
              placeholder={t("quantity_placeholder")}
              required
            />
          </label>
          <label className="field">
            {t("field_quality")}
            <select value={f.quality} onChange={set("quality")}>
              <option value="A">{t("grade_a")}</option>
              <option value="B">{t("grade_b")}</option>
              <option value="C">{t("grade_c")}</option>
            </select>
          </label>
        </div>

        <label className="field">
          {t("field_location")}
          <input
            value={f.location}
            onChange={set("location")}
            placeholder={t("location_placeholder")}
            required
          />
        </label>

        <label className="field">
          {roleCfg.priceLabel}
          <input
            type="number"
            min="0"
            step="0.5"
            inputMode="decimal"
            value={f.price_per_kg}
            onChange={set("price_per_kg")}
            placeholder="18"
            required
          />
        </label>

        {mandi && (
          <div className="hint-box">
            <p>
              {t("mandi_rate_for")} {translateCrop(mandi.name, lang)}: {t("average")}{" "}
              <strong>₹{mandi.modal.toFixed(2)}{t("per_kg")}</strong>
            </p>
            {price > 0 && <RangeBar price={price} mandi={mandi} />}
          </div>
        )}

        {error && <p className="form-error" role="alert">{error}</p>}

        <button className="btn primary big" disabled={busy}>
          {busy ? t("publishing") : roleCfg.submit}
        </button>
      </form>
    </div>
  );
}
