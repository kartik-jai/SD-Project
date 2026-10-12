const KEY = "agriconnect.session";

export function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}
export function saveSession(s) {
  try {
    s ? localStorage.setItem(KEY, JSON.stringify(s)) : localStorage.removeItem(KEY);
  } catch {
    /* storage blocked: session lasts until reload */
  }
}

let onExpired = () => {};
export const setExpiredHandler = (fn) => (onExpired = fn);

export async function api(path, { method = "GET", body } = {}) {
  const token = loadSession()?.token;
  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
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
  if (c.length < 3 || !prices?.length) return null;
  const rows = prices.filter((p) => {
    const name = p.commodity.toLowerCase();
    return name.includes(c) || c.includes(name.split("(")[0].trim());
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
