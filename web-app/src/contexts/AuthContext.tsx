import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserDetails {
  id?: number;
  name: string;
  email: string;
  gender: string;
  age: number;
  role?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserDetails | null;
  token: string | null;
  login: (token: string, user: UserDetails) => void;
  logout: () => void;
  updateUser: (details: Partial<UserDetails>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'skindetect_token';
const USER_KEY  = 'skindetect_user';
const API_BASE  = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken]               = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user,  setUser]                = useState<UserDetails | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const isAuthenticated = !!token && !!user;

  // Validate token on mount and keep user data fresh
  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => (r.ok ? r.json() : Promise.reject()))
        .then(data => {
          const fresh: UserDetails = {
            id: data.id, name: data.name, email: data.email,
            gender: data.gender, age: data.age, role: data.role,
          };
          setUser(fresh);
          localStorage.setItem(USER_KEY, JSON.stringify(fresh));
        })
        .catch(() => {
          // Token invalid / expired — clear session
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        });
    }
  }, [token]);

  const login = (newToken: string, newUser: UserDetails) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch { /* ignore */ }
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const updateUser = (details: Partial<UserDetails>) => {
    if (!user) return;
    const updated = { ...user, ...details };
    setUser(updated);
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
