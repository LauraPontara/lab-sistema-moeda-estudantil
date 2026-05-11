"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  TOKEN_KEY,
  login as apiLogin,
  getMe,
  getMyProfile,
  type AuthUser,
  type UserProfile,
} from "@/lib/api";

interface AuthContextValue {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const p = await getMyProfile();
      setProfile(p);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) {
      void Promise.resolve().then(() => setIsLoading(false));
      return;
    }
    getMe()
      .then(async (me) => {
        setUser(me);
        try {
          const p = await getMyProfile();
          setProfile(p);
        } catch {
          setProfile(null);
        }
      })
      .catch(() => {
        Cookies.remove(TOKEN_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiLogin(email, password);
      Cookies.set(TOKEN_KEY, res.accessToken, { expires: 1, sameSite: "Lax" });
      setUser(res.user);
      try {
        const p = await getMyProfile();
        setProfile(p);
      } catch {
        setProfile(null);
      }
      router.push("/painel");
    },
    [router]
  );

  const logout = useCallback(() => {
    Cookies.remove(TOKEN_KEY);
    setUser(null);
    setProfile(null);
    router.push("/entrar");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, profile, isLoading, login, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
