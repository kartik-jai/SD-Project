import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, referenceFor, rupee, shortDate } from "../api";
import { useApp } from "../state.jsx";
import { getRoleConfig } from "../roles.js";
import { translateCrop, translateLocation, translatePersonName, translateQuantity } from "../i18n";
import RangeBar from "../components/RangeBar.jsx";

function Card({ item, mine, roleCfg, prices, onRemove, onStartChat, t, lang, user, type }) {
  const [confirm, setConfirm] = useState(false);
  const isLot = type === "lots" || item.farmer_id !== undefined;
  const isMyItem = mine || (isLot ? item.farmer_id === user?.id : item.buyer_id === user?.id);
  const canChat =
    !isMyItem &&
    ((user?.role === "Buyer" && isLot) || (user?.role === "Farmer" && !isLot));

  let word;
  if (isMyItem) {
    word = isLot ? t("farmer_asks") : t("buyer_offers");
  } else {
    word = isLot ? t("buyer_asks") : t("farmer_offers");
  }

  const roleName = isLot ? t("role_farmer") : t("role_buyer");
  let ownerDisplay;
  const rawName = item.owner_name || t("unknown");
  const displayName = translatePersonName(rawName, lang);

  // Avoid duplicate role in name when displayed with roleName (e.g. "Farmer: Gurdeep Farmer")
  let cleanName = displayName;
  if (lang === "en") {
    if (isLot && cleanName.endsWith(" Farmer")) cleanName = cleanName.slice(0, -7).trim();
    else if (!isLot && cleanName.endsWith(" Buyer")) cleanName = cleanName.slice(0, -6).trim();
  } else if (lang === "hi") {
    if (isLot && cleanName.endsWith(" किसान")) cleanName = cleanName.slice(0, -6).trim();
    else if (!isLot && cleanName.endsWith(" खरीदार")) cleanName = cleanName.slice(0, -8).trim();
  } else if (lang === "pa") {
    if (isLot && cleanName.endsWith(" ਕਿਸਾਨ")) cleanName = cleanName.slice(0, -6).trim();
    else if (!isLot && cleanName.endsWith(" ਖ਼ਰੀਦਦਾਰ")) cleanName = cleanName.slice(0, -9).trim();
  }

  if (mine) {
    ownerDisplay = `${t("posted_on")} ${shortDate(item.created_at)}`;
  } else if (isMyItem) {
    ownerDisplay = `${roleName}: ${cleanName} (${t("you")}) · ${shortDate(item.created_at)}`;
  } else {
    ownerDisplay = `${roleName}: ${cleanName} · ${shortDate(item.created_at)}`;
  }

  const deleteAction = isLot ? t("delete_lot") : t("cancel_demand");
  const deleteConfirm = isLot ? t("yes_delete") : t("yes_cancel");

  return (
    <article className={`card listing ${isMyItem && !mine ? "highlight-mine" : ""}`}>
      <div className="listing-head">
        <div>
          <h2>{translateCrop(item.crop, lang)}</h2>
          <p className="meta">{translateQuantity(item.quantity, lang)} · {translateLocation(item.location, lang)}</p>
        </div>
        <div className="price">
          <span>{word}</span>
          <strong>
            {rupee(item.price_per_kg)}
            <small>{t("per_kg")}</small>
          </strong>
        </div>
      </div>

      <RangeBar price={item.price_per_kg} mandi={referenceFor(item.crop, prices)} />

      <footer>
        <span className={`grade g${item.quality}`}>
          {t("grade_label")} {item.quality}
        </span>
        <span className="by">{ownerDisplay}</span>
        {isMyItem ? (
          confirm ? (
            <span className="confirm">
              <button className="btn danger" onClick={() => onRemove(isLot)}>
                {deleteConfirm}
              </button>
              <button className="btn quiet" onClick={() => setConfirm(false)}>
                {t("keep")}
              </button>
            </span>
          ) : (
            <button className="btn quiet danger-text" onClick={() => setConfirm(true)}>
              {deleteAction}
            </button>
          )
        ) : canChat ? (
          <button
            className="btn chat-action-btn"
            onClick={() => onStartChat(item, isLot)}
            title={t("chat_negotiate")}
          >
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>{t("chat_negotiate")}</span>
          </button>
        ) : null}
      </footer>
    </article>
  );
}

export default function Listings({ scope }) {
  const { user, prices, toast, lang, t } = useApp();
  const navigate = useNavigate();
  const roleCfg = getRoleConfig(user.role, lang);

  const handleStartChat = async (item, isLot) => {
    const recipientId = isLot ? item.farmer_id : item.buyer_id;
    if (!recipientId) return;
    try {
      const conv = await api("/conversations", {
        method: "POST",
        body: {
          recipient_id: recipientId,
          item_type: isLot ? "lot" : "demand",
          item_id: item.id,
        },
      });
      navigate(`/app/chat?id=${conv.id}`);
    } catch (err) {
      toast(err.message, "error");
    }
  };
  const mine = scope === "mine";
  const activeScope = scope === "browse" ? "lots" : scope;

  let path;
  let pageTitle;
  let pageHint;
  let emptyText;
  let type;
  const showTabs = !mine;

  if (mine) {
    type = roleCfg.mine;
    path = `/${roleCfg.mine}/mine`;
    pageTitle = roleCfg.mineTitle;
    pageHint = "";
    emptyText = roleCfg.mineEmpty;
  } else if (activeScope === "lots") {
    type = "lots";
    path = "/lots/all";
    pageTitle = t("nav_browse_buyer");
    pageHint = user?.role === "Farmer" ? t("farmer_lots_hint") : roleCfg.browseHint;
    emptyText = t("no_lots_yet");
  } else {
    type = "demand";
    path = "/demand/all";
    pageTitle = t("nav_browse_farmer");
    pageHint = user?.role === "Buyer" ? t("buyer_demand_hint") : roleCfg.browseHint;
    emptyText = t("no_demand_yet");
  }

  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  const load = useCallback(() => {
    setItems(null);
    setError("");
    api(path).then(setItems).catch((e) => setError(e.message));
  }, [path]);

  useEffect(load, [load]);

  async function remove(id, isLot) {
    const table = isLot ? "lots" : "demand";
    try {
      await api(`/${table}/${id}`, { method: "DELETE" });
      setItems((xs) => xs?.filter((x) => x.id !== id));
      toast(isLot ? t("lot_deleted") : t("demand_cancelled"));
    } catch (e) {
      toast(e.message, "error");
    }
  }

  const shown = items?.filter((i) => {
    const term = q.trim().toLowerCase();
    if (!term) return true;
    const orig = `${i.crop} ${i.location} ${i.quantity} ${i.owner_name || ""}`.toLowerCase();
    const locLocalized = translateLocation(i.location, lang).toLowerCase();
    const cropLocalized = translateCrop(i.crop, lang).toLowerCase();
    const qtyLocalized = translateQuantity(i.quantity, lang).toLowerCase();
    const nameLocalized = translatePersonName(i.owner_name, lang).toLowerCase();
    return (
      orig.includes(term) ||
      locLocalized.includes(term) ||
      cropLocalized.includes(term) ||
      qtyLocalized.includes(term) ||
      nameLocalized.includes(term)
    );
  });

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{pageTitle}</h1>
          {pageHint && <p className="lede">{pageHint}</p>}
          {showTabs && (
            <div className="marketplace-tabs" role="tablist" aria-label="Marketplace categories">
              <Link
                to="/app/lots"
                className={`tab ${activeScope === "lots" ? "active" : ""}`}
                role="tab"
                aria-selected={activeScope === "lots"}
              >
                🌾 {t("nav_browse_buyer")}
              </Link>
              <Link
                to="/app/demand"
                className={`tab ${activeScope === "demand" ? "active" : ""}`}
                role="tab"
                aria-selected={activeScope === "demand"}
              >
                💼 {t("nav_browse_farmer")}
              </Link>
            </div>
          )}
        </div>
        {items?.length > 0 && (
          <input
            className="search"
            type="search"
            placeholder={t("search_crop_location")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label={t("search_crop_location")}
          />
        )}
      </div>

      {error && (
        <div className="state error">
          <p>{error}</p>
          <button className="btn ghost" onClick={load}>
            {t("try_again")}
          </button>
        </div>
      )}

      {!error && items === null && (
        <div className="grid">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card skeleton" />
          ))}
        </div>
      )}

      {items?.length === 0 && (
        <div className="state">
          <p>{emptyText}</p>
          {mine && (
            <Link to="/app/post" className="btn primary">
              {roleCfg.postTitle}
            </Link>
          )}
        </div>
      )}

      {items?.length > 0 && shown.length === 0 && (
        <div className="state">
          <p>{t("nothing_matches", { q })}</p>
        </div>
      )}

      <div className="grid">
        {shown?.map((i) => (
          <Card
            key={i.id}
            item={i}
            mine={mine}
            roleCfg={roleCfg}
            prices={prices}
            onRemove={(isLot) => remove(i.id, isLot)}
            onStartChat={handleStartChat}
            t={t}
            lang={lang}
            user={user}
            type={type}
          />
        ))}
      </div>
    </div>
  );
}
