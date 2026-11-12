import { NavLink, Outlet } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import LanguagePicker from "../components/LanguagePicker.jsx";
import { useApp } from "../state.jsx";
import { getRoleConfig } from "../roles.js";
import { translatePersonName } from "../i18n";

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const ICONS = {
  post: "M12 5v14M5 12h14",
  mine: "M4 7h16M4 12h16M4 17h10",
  lots: "M11 20A7 7 0 0 1 4 13C4 7 11 3 11 3s7 4 7 10a7 7 0 0 1-7 7zM11 20V10",
  demand: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0",
  chat: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  prices: "M4 19V9M10 19V5M16 19v-7M22 19H2",
};

export default function Shell() {
  const { user, signOut, lang, t, unreadChatsCount } = useApp();
  const roleCfg = getRoleConfig(user.role, lang);

  const items = [
    ["post", roleCfg.nav.post],
    ["mine", roleCfg.nav.mine],
    ["lots", roleCfg.nav.lots],
    ["demand", roleCfg.nav.demand],
    ["chat", t("nav_chat")],
    ["prices", t("mandi_rates")],
  ];

  return (
    <div className="shell">
      <aside className="side">
        <div className="side-top">
          <Logo light />
          <div className="side-lang">
            <LanguagePicker variant="dark" />
          </div>
        </div>

        <nav aria-label="Main">
          {items.map(([k, label]) => (
            <NavLink key={k} to={`/app/${k}`} className={({ isActive }) => (isActive ? "active" : "")}>
              <Icon d={ICONS[k]} />
              <span>{label}</span>
              {k === "chat" && unreadChatsCount > 0 && (
                <span className="nav-badge" aria-label={`${unreadChatsCount} unread`}>
                  {unreadChatsCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="who">
          <div>
            <strong>{translatePersonName(user.name, lang)}</strong>
            <span>{roleCfg.roleName}</span>
          </div>
          <button className="btn quiet" onClick={signOut}>{t("logout")}</button>
        </div>
      </aside>

      <main className="content">
        <div className="content-mobile-lang">
          <LanguagePicker variant="light" />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
