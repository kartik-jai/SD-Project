import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import RateBoard from "../components/RateBoard.jsx";
import LanguagePicker from "../components/LanguagePicker.jsx";
import { useApp } from "../state.jsx";

export default function Landing() {
  const { prices, t } = useApp();

  return (
    <div className="landing">
      <header className="topbar">
        <Logo />
        <div className="topbar-right">
          <LanguagePicker variant="light" />
          <nav>
            <Link to="/login" className="btn ghost">{t("login")}</Link>
            <Link to="/register" className="btn primary">{t("create_account")}</Link>
          </nav>
        </div>
      </header>

      <main className="hero">
        <div className="hero-copy">
          <h1>{t("hero_title")}</h1>
          <p>{t("hero_desc")}</p>
          <div className="hero-actions">
            <Link to="/register" className="btn primary big">{t("create_free_acc")}</Link>
            <Link to="/login" className="btn ghost big">{t("already_have_one")}</Link>
          </div>
        </div>
        <RateBoard rows={prices} limit={7} title={t("mandi_rates_today")} />
      </main>

      <section className="how">
        <div>
          <h3>{t("how_farmers_title")}</h3>
          <p>{t("how_farmers_desc")}</p>
        </div>
        <div>
          <h3>{t("how_buyers_title")}</h3>
          <p>{t("how_buyers_desc")}</p>
        </div>
        <div>
          <h3>{t("how_both_title")}</h3>
          <p>{t("how_both_desc")}</p>
        </div>
      </section>

      <footer className="foot">{t("footer_text")}</footer>
    </div>
  );
}
