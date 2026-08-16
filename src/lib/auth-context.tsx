'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isLoggedIn: boolean;
  isArtisan: boolean;
  isAdmin: boolean;
  activeStoreId: string;
  loginAs: (role: UserRole) => void;
  loginWithEmail: (email: string, role?: UserRole) => void;
  logout: () => void;
}

const DEMO_USERS: Record<UserRole, UserProfile> = {
  ARTISAN: {
    id: 'user-artisan-1',
    email: 'claudio@ceramicadaterra.com.br',
    fullName: 'Mestre Cláudio Fontana',
    role: 'ARTISAN',
    phone: '(11) 99876-1234',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    createdAt: '2026-01-01T00:00:00Z',
  },
  ADMIN: {
    id: 'user-admin-1',
    email: 'admin@descubraartes.com.br',
    fullName: 'Administrador Regional',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    createdAt: '2026-01-01T00:00:00Z',
  },
  CUSTOMER: {
    id: 'user-tourist-1',
    email: 'turista@destinobrasil.com.br',
    fullName: 'Mariana Silveira',
    role: 'CUSTOMER',
    phone: '(11) 98888-7777',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    createdAt: '2026-02-01T00:00:00Z',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEMO_USERS.ARTISAN); // Default to artisan demo for instant discovery of the panel
  const [activeStoreId, setActiveStoreId] = useState<string>('store-ceramica-da-terra');

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('descubra_artes_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {}
  }, []);

  const loginAs = (role: UserRole) => {
    const demo = DEMO_USERS[role];
    setUser(demo);
    if (role === 'ARTISAN') {
      setActiveStoreId('store-ceramica-da-terra');
    }
    try {
      localStorage.setItem('descubra_artes_user', JSON.stringify(demo));
    } catch {}
  };

  const loginWithEmail = (email: string, role: UserRole = 'ARTISAN') => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      fullName: email.split('@')[0],
      role,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    try {
      localStorage.setItem('descubra_artes_user', JSON.stringify(newUser));
    } catch {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('descubra_artes_user');
    } catch {}
  };

  const currentRole = user?.role || 'CUSTOMER';

  return (
    <AuthContext.Provider
      value={{
        user,
        role: currentRole,
        isLoggedIn: !!user,
        isArtisan: currentRole === 'ARTISAN',
        isAdmin: currentRole === 'ADMIN',
        activeStoreId,
        loginAs,
        loginWithEmail,
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
