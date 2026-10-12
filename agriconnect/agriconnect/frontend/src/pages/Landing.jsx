import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import RateBoard from "../components/RateBoard.jsx";
import { useApp } from "../state.jsx";

export default function Landing() {
  const { prices } = useApp();
  return (
    <div className="landing">
      <header className="topbar">
        <Logo />
        <nav>
          <Link to="/login" className="btn ghost">Log in</Link>
          <Link to="/register" className="btn primary">Create account</Link>
        </nav>
      </header>
      <main className="hero">
        <div className="hero-copy">
          <h1>Know the mandi rate before you name your price.</h1>
          <p>
            Farmers post what they have. Buyers post what they need. Every listing shows the price per kg next to
            today's government mandi rates, so both sides start from the same number.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn primary big">Create a free account</Link>
            <Link to="/login" className="btn ghost big">I already have one</Link>
          </div>
        </div>
        <RateBoard rows={prices} limit={7} />
      </main>
      <section className="how">
        <div>
          <h3>Farmers</h3>
          <p>Post a lot with quantity, grade, location and your price. See what buyers are asking for.</p>
        </div>
        <div>
          <h3>Buyers</h3>
          <p>Post the demand you need filled and the price you will pay. Browse every farmer's lot.</p>
        </div>
        <div>
          <h3>Both</h3>
          <p>A price bar on each listing shows how far it sits from the mandi average.</p>
        </div>
      </section>
      <footer className="foot">AgriConnect · Software Engineering project, Thapar Institute (UCS503P)</footer>
    </div>
  );
}
