import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/authService.js";

const AuthContext = createContext({ user: null, loading: true, setUser: () => {}, logout: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const profile = await getMe();
        if (mounted) {
          setUser(profile);
        }
      } catch (error) {
        console.warn("Failed to fetch current user", error?.message || error);
        localStorage.removeItem("token");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
