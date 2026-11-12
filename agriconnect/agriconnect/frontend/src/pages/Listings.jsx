import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, referenceFor, rupee, shortDate } from "../api";
import { useApp } from "../state.jsx";
import { ROLE } from "../roles.js";
import RangeBar from "../components/RangeBar.jsx";

function Card({ item, mine, t, prices, onRemove }) {
  const [confirm, setConfirm] = useState(false);
  const word = mine ? t.priceWord : t.otherPriceWord;
  return (
    <article className="card listing">
      <div className="listing-head">
        <div>
          <h2>{item.crop}</h2>
          <p className="meta">{item.quantity} · {item.location}</p>
        </div>
        <div className="price">
          <span>{word}</span>
          <strong>{rupee(item.price_per_kg)}<small>/kg</small></strong>
        </div>
      </div>
      <RangeBar price={item.price_per_kg} mandi={referenceFor(item.crop, prices)} />
      <footer>
        <span className={`grade g${item.quality}`}>Grade {item.quality}</span>
        <span className="by">{mine ? `Posted ${shortDate(item.created_at)}` : `${t.ownerWord}: ${item.owner_name || "Unknown"} · ${shortDate(item.created_at)}`}</span>
        {mine && (confirm ? (
          <span className="confirm">
            <button className="btn danger" onClick={onRemove}>Yes, {t.remove.toLowerCase()}</button>
            <button className="btn quiet" onClick={() => setConfirm(false)}>Keep</button>
          </span>
        ) : (
          <button className="btn quiet danger-text" onClick={() => setConfirm(true)}>{t.remove}</button>
        ))}
      </footer>
    </article>
  );
}

export default function Listings({ scope }) {
  const { user, prices, toast } = useApp();
  const t = ROLE[user.role];
  const mine = scope === "mine";
  const path = mine ? `/${t.mine}/mine` : `/${t.other}/all`;
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  const load = useCallback(() => {
    setItems(null);
    setError("");
    api(path).then(setItems).catch((e) => setError(e.message));
  }, [path]);
  useEffect(load, [load]);

  async function remove(id) {
    try {
      await api(`/${t.mine}/${id}`, { method: "DELETE" });
      setItems((xs) => xs.filter((x) => x.id !== id));
      toast(t.removed);
    } catch (e) {
      toast(e.message, "error");
    }
  }

  const shown = items?.filter((i) => `${i.crop} ${i.location}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{mine ? t.mineTitle : t.browseTitle}</h1>
          {!mine && <p className="lede">{t.browseHint}</p>}
        </div>
        {items?.length > 0 && (
          <input className="search" type="search" placeholder="Search crop or location" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search crop or location" />
        )}
      </div>
      {error && (
        <div className="state error"><p>{error}</p><button className="btn ghost" onClick={load}>Try again</button></div>
      )}
      {!error && items === null && <div className="grid">{[0, 1, 2].map((i) => <div key={i} className="card skeleton" />)}</div>}
      {items?.length === 0 && (
        <div className="state">
          <p>{mine ? t.mineEmpty : t.browseEmpty}</p>
          {mine && <Link to="/app/post" className="btn primary">{t.postTitle}</Link>}
        </div>
      )}
      {items?.length > 0 && shown.length === 0 && <div className="state"><p>Nothing matches "{q}". Try another crop or place.</p></div>}
      <div className="grid">
        {shown?.map((i) => <Card key={i.id} item={i} mine={mine} t={t} prices={prices} onRemove={() => remove(i.id)} />)}
      </div>
    </div>
  );
}
