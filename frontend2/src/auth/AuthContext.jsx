import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { language, setLanguage } = useLanguage();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const loadMe = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setReady(true);
      return;
    }
    try {
      const data = await api.me();
      setUser(data);
      if (data.language) setLanguage(data.language);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setReady(true);
    }
  }, [setLanguage]);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const acceptAuth = useCallback((payload) => {
    setToken(payload.access_token);
    setUser(payload.user);
    if (payload.user?.language) setLanguage(payload.user.language);
    return payload.user;
  }, [setLanguage]);

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthenticated: Boolean(user),
      signup: async (body) => acceptAuth(await api.signup({ ...body, language })),
      requestOtp: api.requestOtp,
      verifyOtp: async (phone, otp) => acceptAuth(await api.verifyOtp(phone, otp)),
      logout: () => {
        setToken(null);
        setUser(null);
      },
      deleteAccount: async () => {
        await api.deleteAccount();
        setToken(null);
        setUser(null);
      },
      refresh: loadMe,
      setUser,
    }),
    [acceptAuth, language, loadMe, user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
