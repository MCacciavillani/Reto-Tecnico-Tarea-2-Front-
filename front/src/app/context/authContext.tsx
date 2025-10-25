"use client";
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";

interface JWTPayload {
  exp: number;
  id: string,
  email: string,
  name: string,
  phone: string,
  messageCount: number,
  company: string,
  role: string,
}

interface AuthContextType {
  user: JWTPayload | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const router=useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<JWTPayload>(storedToken);
        if (decoded.exp > Date.now() / 1000) {
          setToken(storedToken);
          setUser(decoded);
        } else {
          localStorage.removeItem("access_token");
        }
      } catch {
        localStorage.removeItem("access_token");
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("access_token", token);
    const decoded = jwtDecode<JWTPayload>(token);
    setUser(decoded);
    setToken(token);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
