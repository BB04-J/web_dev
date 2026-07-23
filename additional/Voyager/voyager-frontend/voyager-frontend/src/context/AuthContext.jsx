import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/tripsApi";

const AuthContext = createContext(null);

const TOKEN_KEY = "voyager_token";
const USER_KEY = "voyager_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // On first load, verify any stored token is still valid.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then(({ data }) => {
        setUser(data.data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = ({ user: nextUser, token }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const register = async (payload) => {
    const { data } = await authApi.register(payload);
    persistSession(data.data);
    return data.data.user;
  };

  const login = async (payload) => {
    const { data } = await authApi.login(payload);
    persistSession(data.data);
    return data.data.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      register,
      login,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
