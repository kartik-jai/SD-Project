import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import RateBoard from "../components/RateBoard.jsx";
import LanguagePicker from "../components/LanguagePicker.jsx";
import { api } from "../api";
import { useApp } from "../state.jsx";
import { translatePersonName } from "../i18n";

export default function Auth({ mode }) {
  const reg = mode === "register";
  const { signIn, prices, toast, t, lang } = useApp();
  const [f, setF] = useState({ name: "", phone: "", password: "", role: "Farmer" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const s = await api(reg ? "/register" : "/login", { method: "POST", body: f });
      signIn(s);
      toast(
        reg
          ? `${t("welcome")}, ${translatePersonName(s.user.name, lang)}`
          : `${t("welcome_back")}, ${translatePersonName(s.user.name, lang)}`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth-form">
        <div className="auth-header">
          <Link to="/"><Logo /></Link>
          <LanguagePicker variant="light" />
        </div>

        <h1>{reg ? t("register_title") : t("login_title")}</h1>

        <form onSubmit={submit} noValidate>
          {reg && (
            <fieldset className="roles">
              <legend>{t("i_am_a")}</legend>
              {[
                { val: "Farmer", label: t("role_farmer") },
                { val: "Buyer", label: t("role_buyer") },
              ].map(({ val, label }) => (
                <label key={val} className={f.role === val ? "on" : ""}>
                  <input type="radio" name="role" value={val} checked={f.role === val} onChange={set("role")} />
                  {label}
                </label>
              ))}
            </fieldset>
          )}

          {reg && (
            <label className="field">
              {t("full_name")}
              <input value={f.name} onChange={set("name")} autoComplete="name" required />
            </label>
          )}

          <label className="field">
            {t("phone_number")}
            <input
              value={f.phone}
              onChange={set("phone")}
              inputMode="tel"
              autoComplete="tel"
              placeholder={t("phone_placeholder")}
              required
            />
          </label>

          <label className="field">
            {t("password")}
            <input
              type="password"
              value={f.password}
              onChange={set("password")}
              autoComplete={reg ? "new-password" : "current-password"}
              placeholder={reg ? t("password_placeholder") : ""}
              required
            />
          </label>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="btn primary big" disabled={busy}>
            {busy ? t("please_wait") : reg ? t("create_account") : t("login")}
          </button>
        </form>

        <p className="switch">
          {reg ? t("already_account_q") : t("new_to_agri_q")}{" "}
          <Link to={reg ? "/login" : "/register"}>{reg ? t("login") : t("create_account")}</Link>
        </p>
      </div>

      <aside className="auth-side">
        <RateBoard rows={prices} limit={5} title={t("mandi_rates_today")} />
      </aside>
    </div>
  );
}
