import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Role = 'customer' | 'driver' | 'owner';

type User = {
  id: string;
  email: string;
  name?: string;
  role: Role;
  status?: 'active' | 'pending' | 'rejected';
};

type AuthContextValue = {
  user: User | null;
  role: Role | null;
  loading: boolean;
  login: (email: string, password: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  registerCustomer: (name: string, email: string, password: string) => Promise<void>;
  submitDriverApplication: (payload: Record<string, any>) => Promise<void>;
  registerOwner: (name: string, email: string, password: string) => Promise<void>;
};

const STORAGE_USER = 'auth_user_v1';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_USER);
        if (raw) {
          setUser(JSON.parse(raw));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (u: User | null) => {
    setUser(u);
    if (u) await AsyncStorage.setItem(STORAGE_USER, JSON.stringify(u));
    else await AsyncStorage.removeItem(STORAGE_USER);
  }, []);

  const login = useCallback(async (email: string, password: string, role: Role) => {
    // Local mock auth rules
    // Admin (owner) is a fixed credential pair and cannot be registered.
    if (role === 'owner') {
      if (email !== 'Admin' || password !== 'Habibi321') {
        throw new Error('Invalid admin credentials. Use Admin / Habibi321');
      }
    }

    const fakeUser: User = {
      id: Math.random().toString(36).slice(2),
      email,
      role,
      status: role === 'driver' ? 'pending' : 'active',
    };
    await persist(fakeUser);
  }, [persist]);

  const logout = useCallback(async () => {
    await persist(null);
  }, [persist]);

  const registerCustomer = useCallback(async (name: string, email: string, _password: string) => {
    const u: User = { id: Math.random().toString(36).slice(2), email, name, role: 'customer', status: 'active' };
    await persist(u);
  }, [persist]);

  const submitDriverApplication = useCallback(async (_payload: Record<string, any>) => {
    // Store pending user; owner can approve later
    const u: User = {
      id: Math.random().toString(36).slice(2),
      email: _payload?.email ?? 'driver@example.com',
      name: _payload?.name ?? 'Driver',
      role: 'driver',
      status: 'pending',
    };
    await persist(u);
  }, [persist]);

  const registerOwner = useCallback(async (name: string, email: string, _password: string) => {
    const u: User = { id: Math.random().toString(36).slice(2), email, name, role: 'owner', status: 'active' };
    await persist(u);
  }, [persist]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    role: user?.role ?? null,
    loading,
    login,
    logout,
    registerCustomer,
    submitDriverApplication,
    registerOwner,
  }), [user, loading, login, logout, registerCustomer, submitDriverApplication, registerOwner]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
