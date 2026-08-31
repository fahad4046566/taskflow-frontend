"use client";

import api from "@/lib/api";
import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const { access_token } = response.data;

    setToken(access_token);

    const profileResponse = await api.get("/auth/profile", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    setUser(profileResponse.data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login: async () => {},
        register: async () => {},
        logout: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
