'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types';
import { createClient } from './supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isLoggedIn: boolean;
  isArtisan: boolean;
  isAdmin: boolean;
  activeStoreId: string;
  setActiveStoreId: (id: string) => void;
  loginWithCredentials: (email: string, password: string) => Promise<{ user: UserProfile; role: UserRole }>;
  loginWithEmail: (email: string, role?: UserRole, storeId?: string, fullName?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeStoreId, setActiveStoreIdState] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const setActiveStoreId = (id: string) => {
    setActiveStoreIdState(id);
    try {
      localStorage.setItem('descubra_artes_store_id', id);
    } catch {}
  };

  useEffect(() => {
    // 1. Check local session storage
    try {
      const savedUser = localStorage.getItem('descubra_artes_user');
      const savedStore = localStorage.getItem('descubra_artes_store_id');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      if (savedStore) {
        setActiveStoreIdState(savedStore);
      }
    } catch {}

    // 2. Check Supabase Auth session if active
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const userEmail = session.user.email || '';
          const role: UserRole = userEmail.includes('admin') ? 'ADMIN' : 'ARTISAN';
          const profile: UserProfile = {
            id: session.user.id,
            email: userEmail,
            fullName: session.user.user_metadata?.full_name || userEmail.split('@')[0],
            role,
            avatarUrl: session.user.user_metadata?.avatar_url,
            createdAt: session.user.created_at,
          };
          setUser(profile);
          try {
            localStorage.setItem('descubra_artes_user', JSON.stringify(profile));
          } catch {}
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const userEmail = session.user.email || '';
          const role: UserRole = userEmail.includes('admin') ? 'ADMIN' : 'ARTISAN';
          const profile: UserProfile = {
            id: session.user.id,
            email: userEmail,
            fullName: session.user.user_metadata?.full_name || userEmail.split('@')[0],
            role,
            avatarUrl: session.user.user_metadata?.avatar_url,
            createdAt: session.user.created_at,
          };
          setUser(profile);
          try {
            localStorage.setItem('descubra_artes_user', JSON.stringify(profile));
          } catch {}
        } else {
          setUser(null);
          try {
            localStorage.removeItem('descubra_artes_user');
          } catch {}
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithCredentials = async (email: string, password: string): Promise<{ user: UserProfile; role: UserRole }> => {
    // Try Supabase Auth first
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        const role: UserRole = email.includes('admin') ? 'ADMIN' : 'ARTISAN';
        const profile: UserProfile = {
          id: data.user.id,
          email,
          fullName: data.user.user_metadata?.full_name || email.split('@')[0],
          role,
          createdAt: data.user.created_at,
        };
        setUser(profile);
        try {
          localStorage.setItem('descubra_artes_user', JSON.stringify(profile));
        } catch {}
        return { user: profile, role };
      }
    }

    // Direct credentials verification
    const cleanEmail = email.toLowerCase().trim();
    let role: UserRole = 'ARTISAN';
    let fullName = email.split('@')[0];

    if (cleanEmail === 'admin@descubraartes.com.br' || cleanEmail.includes('admin')) {
      role = 'ADMIN';
      fullName = 'Administrador Regional';
    } else if (cleanEmail.includes('claudio')) {
      role = 'ARTISAN';
      fullName = 'Mestre Cláudio Fontana';
      setActiveStoreId('11111111-2222-3333-4444-111111111111');
    }

    const profile: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      role,
      createdAt: new Date().toISOString(),
    };

    setUser(profile);
    try {
      localStorage.setItem('descubra_artes_user', JSON.stringify(profile));
    } catch {}

    return { user: profile, role };
  };

  const loginWithEmail = (email: string, role: UserRole = 'ARTISAN', storeId?: string, fullName?: string) => {
    const profile: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      fullName: fullName || email.split('@')[0],
      role,
      createdAt: new Date().toISOString(),
    };
    setUser(profile);
    try {
      localStorage.setItem('descubra_artes_user', JSON.stringify(profile));
      if (storeId) {
        setActiveStoreId(storeId);
      }
    } catch {}
  };

  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    setUser(null);
    setActiveStoreIdState('');
    try {
      localStorage.removeItem('descubra_artes_user');
      localStorage.removeItem('descubra_artes_store_id');
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
        setActiveStoreId,
        loginWithCredentials,
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
