import { getSavedLanguage } from "./i18n";

const KEY = "agriconnect.session";

export function loadSession() {
  try {
    const raw = sessionStorage.getItem(KEY) || localStorage.getItem(KEY);
    if (!raw) return null;
    if (!sessionStorage.getItem(KEY)) {
      sessionStorage.setItem(KEY, raw);
    }
    return JSON.parse(raw) || null;
  } catch {
    return null;
  }
}
export function saveSession(s) {
  try {
    if (s) {
      sessionStorage.setItem(KEY, JSON.stringify(s));
      localStorage.setItem(KEY, JSON.stringify(s));
    } else {
      sessionStorage.removeItem(KEY);
      localStorage.removeItem(KEY);
    }
  } catch {
    /* storage blocked: session lasts until reload */
  }
}

let onExpired = () => {};
export const setExpiredHandler = (fn) => (onExpired = fn);

export async function api(path, { method = "GET", body } = {}) {
  const token = loadSession()?.token;
  const lang = getSavedLanguage();
  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Language": lang,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Can't reach the server. Check that the backend is running on port 5000.");
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && token) onExpired();
  if (!res.ok) throw new Error(data.error || "Something went wrong. Try again.");
  return data;
}

/* ---- helpers shared by pages ---- */
export const rupee = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export function shortDate(s) {
  const d = new Date(String(s).replace(" ", "T") + "Z");
  return isNaN(d) ? "" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/** Find the mandi reference for a crop name: exact words first, then substring. */
export function referenceFor(crop, prices) {
  const c = (crop || "").trim().toLowerCase();
  if (c.length < 2 || !prices?.length) return null;
  const rows = prices.filter((p) => {
    const candidates = [p.commodity, p.commodity_en, p.commodity_hi, p.commodity_pa]
      .filter(Boolean)
      .map((s) => s.toLowerCase());
    return candidates.some((cand) => cand.includes(c) || c.includes(cand.split("(")[0].trim()));
  });
  if (!rows.length) return null;
  const avg = (k) => rows.reduce((a, r) => a + r[k], 0) / rows.length;
  return {
    min: Math.min(...rows.map((r) => r.min)),
    max: Math.max(...rows.map((r) => r.max)),
    modal: avg("modal"),
    markets: rows.length,
    name: rows[0].commodity,
  };
}
