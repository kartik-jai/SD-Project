import { NavLink, Outlet } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import { useApp } from "../state.jsx";
import { ROLE } from "../roles.js";

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const ICONS = {
  post: "M12 5v14M5 12h14",
  mine: "M4 7h16M4 12h16M4 17h10",
  browse: "M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  prices: "M4 19V9M10 19V5M16 19v-7M22 19H2",
};

export default function Shell() {
  const { user, signOut } = useApp();
  const t = ROLE[user.role];
  const items = [["post", t.nav.post], ["mine", t.nav.mine], ["browse", t.nav.browse], ["prices", "Mandi rates"]];
  return (
    <div className="shell">
      <aside className="side">
        <Logo light />
        <nav aria-label="Main">
          {items.map(([k, label]) => (
            <NavLink key={k} to={`/app/${k}`} className={({ isActive }) => (isActive ? "active" : "")}>
              <Icon d={ICONS[k]} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="who">
          <div>
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>
          <button className="btn quiet" onClick={signOut}>Log out</button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
