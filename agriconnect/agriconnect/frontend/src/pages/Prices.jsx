import { useMemo, useState } from "react";
import { useApp } from "../state.jsx";
import RateBoard from "../components/RateBoard.jsx";

export default function Prices() {
  const { prices } = useApp();
  const [q, setQ] = useState("");
  const rows = useMemo(
    () => prices.filter((p) => `${p.commodity} ${p.market} ${p.state} ${p.district}`.toLowerCase().includes(q.toLowerCase())),
    [prices, q]
  );
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Mandi rates</h1>
          <p className="lede">Government market prices from Agmarknet, converted to ₹ per kg.</p>
        </div>
        <input className="search" type="search" placeholder="Search crop, market or state" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search rates" />
      </div>
      {prices.length === 0 ? (
        <div className="state"><p>No rates loaded. Copy prices.csv into the backend folder and restart the API.</p></div>
      ) : rows.length === 0 ? (
        <div className="state"><p>Nothing matches "{q}". Try another crop, market or state.</p></div>
      ) : (
        <>
          <RateBoard rows={rows} limit={500} title={`${rows.length} rates`} />
        </>
      )}
    </div>
  );
}
