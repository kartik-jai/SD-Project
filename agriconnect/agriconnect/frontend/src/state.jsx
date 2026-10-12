import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, loadSession, saveSession, setExpiredHandler } from "./api";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [session, setSession] = useState(loadSession);
  const [prices, setPrices] = useState([]);
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((text, kind = "ok") => {
    const id = Math.random();
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const signIn = (s) => {
    saveSession(s);
    setSession(s);
  };
  const signOut = useCallback(() => {
    saveSession(null);
    setSession(null);
  }, []);

  useEffect(() => {
    setExpiredHandler(() => {
      signOut();
      toast("Your session expired. Log in again.", "error");
    });
  }, [signOut, toast]);

  useEffect(() => {
    api("/prices").then(setPrices).catch(() => {});
  }, []);

  return (
    <Ctx.Provider value={{ user: session?.user, session, signIn, signOut, prices, toast }}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind}`}>
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
