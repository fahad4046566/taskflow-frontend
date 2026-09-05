"use client";
import api, { setAccessToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const response = await api.post("/auth/refresh-token");
        const data = response.data;
        setToken(data.access_token);
        setAccessToken(data.access_token);
      } catch (error: any) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    }
    checkAuthStatus();
  }, []);

  const router = useRouter();

  const register = async (name: string, email: string, password: string) => {
    try {
      await api.post("/auth/register", { name, email, password });
      toast.success("Account create successfully. Please login!");
      router.push("/login");
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token } = response.data;

      setToken(access_token);
      setAccessToken(access_token);

      const profileResponse = await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setUser(profileResponse.data);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
      throw error;
    }
  };
  const logout = async () => {
    try {
      const response = await api.post("/auth/logout");
      setUser(null);
      setToken(null);
      setAccessToken(null);
      toast.warning(response.data?.message || "Logged out");
      router.push("/login");
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        token,
        login,
        register,
        logout,
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
