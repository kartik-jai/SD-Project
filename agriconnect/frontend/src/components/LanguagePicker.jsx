import { LANGUAGES } from "../i18n";
import { useApp } from "../state.jsx";

export default function LanguagePicker({ variant = "light" }) {
  const { lang, setLang } = useApp();

  return (
    <div className={`lang-switch ${variant}`} role="group" aria-label="Select language / भाषा चुनें / ਭਾਸ਼ਾ ਚੁਣੋ">
      <span className="lang-icon" aria-hidden="true" title="Language">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </span>
      <div className="lang-options">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            className={`lang-btn ${lang === l.code ? "active" : ""}`}
            onClick={() => setLang(l.code)}
            aria-pressed={lang === l.code}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
