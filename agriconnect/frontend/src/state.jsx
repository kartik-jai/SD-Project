import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, loadSession, saveSession, setExpiredHandler } from "./api";
import { getSavedLanguage, saveLanguage, TRANSLATIONS } from "./i18n";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [session, setSession] = useState(loadSession);
  const [prices, setPrices] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [lang, setLangState] = useState(getSavedLanguage);
  const [unreadChatsCount, setUnreadChatsCount] = useState(0);

  const refreshUnreadCount = useCallback(() => {
    if (!session?.token) {
      setUnreadChatsCount(0);
      return;
    }
    api("/conversations/unread-count")
      .then((data) => setUnreadChatsCount(data.unread_count || 0))
      .catch(() => {});
  }, [session?.token]);

  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, 8000);
    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  const setLang = useCallback((newLang) => {
    saveLanguage(newLang);
    setLangState(newLang);
  }, []);

  const t = useCallback(
    (key, params = {}) => {
      let str = TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, v);
      });
      return str;
    },
    [lang]
  );

  const toast = useCallback((text, kind = "ok") => {
    const id = Math.random();
    setToasts((toastsList) => [...toastsList, { id, text, kind }]);
    setTimeout(() => setToasts((toastsList) => toastsList.filter((x) => x.id !== id)), 4000);
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
      toast(t("session_expired"), "error");
    });
  }, [signOut, toast, t]);

  useEffect(() => {
    api("/prices").then(setPrices).catch(() => {});
    if (session?.token) {
      api("/me")
        .then((meData) => {
          if (meData && meData.id && meData.id !== session.user?.id) {
            const updated = { ...session, user: meData };
            saveSession(updated);
            setSession(updated);
          }
        })
        .catch(() => {});
    }
  }, []);

  return (
    <Ctx.Provider
      value={{
        user: session?.user,
        session,
        signIn,
        signOut,
        prices,
        toast,
        lang,
        setLang,
        t,
        unreadChatsCount,
        refreshUnreadCount,
      }}
    >
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((toastItem) => (
          <div key={toastItem.id} className={`toast ${toastItem.kind}`}>
            {toastItem.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
