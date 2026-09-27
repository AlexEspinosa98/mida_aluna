"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { login as apiLogin } from "@/lib/api";

interface AuthUser {
  token: string;
  username: string;
  nombre: string;
  rol: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = "mida-auth";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // La sesión persistida solo puede leerse en el cliente (localStorage), por eso se
  // hidrata en un efecto en vez de en el estado inicial.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // localStorage no disponible (modo privado, etc.); se sigue sin sesión persistida.
    }
    setLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(username: string, password: string) {
        const res = await apiLogin(username, password);
        const nextUser: AuthUser = {
          token: res.token,
          username: res.username,
          nombre: res.nombre,
          rol: res.rol,
        };
        setUser(nextUser);
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        } catch {
          // ignorar si no hay storage disponible
        }
      },
      logout() {
        setUser(null);
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignorar si no hay storage disponible
        }
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
