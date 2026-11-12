import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import RateBoard from "../components/RateBoard.jsx";
import { api } from "../api";
import { useApp } from "../state.jsx";

export default function Auth({ mode }) {
  const reg = mode === "register";
  const { signIn, prices, toast } = useApp();
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
      toast(reg ? `Welcome, ${s.user.name}` : `Welcome back, ${s.user.name}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth-form">
        <Link to="/"><Logo /></Link>
        <h1>{reg ? "Create your account" : "Log in"}</h1>
        <form onSubmit={submit} noValidate>
          {reg && (
            <fieldset className="roles">
              <legend>I am a</legend>
              {["Farmer", "Buyer"].map((r) => (
                <label key={r} className={f.role === r ? "on" : ""}>
                  <input type="radio" name="role" value={r} checked={f.role === r} onChange={set("role")} />
                  {r}
                </label>
              ))}
            </fieldset>
          )}
          {reg && (
            <label className="field">Full name
              <input value={f.name} onChange={set("name")} autoComplete="name" required />
            </label>
          )}
          <label className="field">Phone number
            <input value={f.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" required />
          </label>
          <label className="field">Password
            <input type="password" value={f.password} onChange={set("password")} autoComplete={reg ? "new-password" : "current-password"} placeholder={reg ? "At least 6 characters" : ""} required />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn primary big" disabled={busy}>{busy ? "Please wait…" : reg ? "Create account" : "Log in"}</button>
        </form>
        <p className="switch">
          {reg ? "Already have an account?" : "New to AgriConnect?"}{" "}
          <Link to={reg ? "/login" : "/register"}>{reg ? "Log in" : "Create an account"}</Link>
        </p>
      </div>
      <aside className="auth-side">
        <RateBoard rows={prices} limit={5} />
      </aside>
    </div>
  );
}
