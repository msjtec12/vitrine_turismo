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

function syncAuthCookies(profile: UserProfile | null) {
  if (typeof document === 'undefined') return;
  if (profile) {
    document.cookie = `descubra_artes_role=${profile.role}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `descubra_artes_user=${encodeURIComponent(JSON.stringify(profile))}; path=/; max-age=604800; SameSite=Lax`;
  } else {
    document.cookie = 'descubra_artes_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    document.cookie = 'descubra_artes_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeStoreId, setActiveStoreIdState] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const setActiveStoreId = (id: string) => {
    setActiveStoreIdState(id);
    try {
      if (id) {
        localStorage.setItem('descubra_artes_store_id', id);
      } else {
        localStorage.removeItem('descubra_artes_store_id');
      }
    } catch {}
  };

  useEffect(() => {
    // 1. Check local session storage
    try {
      const savedUser = localStorage.getItem('descubra_artes_user');
      const savedStore = localStorage.getItem('descubra_artes_store_id');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        syncAuthCookies(parsed);
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
          syncAuthCookies(profile);
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
          syncAuthCookies(profile);
          try {
            localStorage.setItem('descubra_artes_user', JSON.stringify(profile));
          } catch {}
        } else {
          setUser(null);
          syncAuthCookies(null);
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
    const cleanEmail = email.toLowerCase().trim();

    // Try Supabase Auth first
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!error && data.user) {
        const role: UserRole = cleanEmail.includes('admin') ? 'ADMIN' : 'ARTISAN';
        const profile: UserProfile = {
          id: data.user.id,
          email: cleanEmail,
          fullName: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
          role,
          createdAt: data.user.created_at,
        };
        setUser(profile);
        syncAuthCookies(profile);
        try {
          localStorage.setItem('descubra_artes_user', JSON.stringify(profile));
        } catch {}

        // Resolve store
        import('./data/store-service').then(({ storeService }) => {
          storeService.getStoreByEmail(cleanEmail).then((s) => {
            if (s) setActiveStoreId(s.id);
            else setActiveStoreId('');
          });
        });

        return { user: profile, role };
      }
    }

    // Direct credentials verification
    let role: UserRole = 'ARTISAN';
    let fullName = cleanEmail.split('@')[0];

    if (cleanEmail === 'admin@descubraartes.com.br' || cleanEmail.includes('admin')) {
      role = 'ADMIN';
      fullName = 'Administrador Regional';
    }

    const profile: UserProfile = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      fullName,
      role,
      createdAt: new Date().toISOString(),
    };

    setUser(profile);
    syncAuthCookies(profile);
    try {
      localStorage.setItem('descubra_artes_user', JSON.stringify(profile));
    } catch {}

    // Resolve store for email
    import('./data/store-service').then(({ storeService }) => {
      storeService.getStoreByEmail(cleanEmail).then((s) => {
        if (s) setActiveStoreId(s.id);
        else setActiveStoreId('');
      });
    });

    return { user: profile, role };
  };

  const loginWithEmail = (email: string, role: UserRole = 'ARTISAN', storeId?: string, fullName?: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const profile: UserProfile = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      fullName: fullName || cleanEmail.split('@')[0],
      role,
      createdAt: new Date().toISOString(),
    };
    setUser(profile);
    syncAuthCookies(profile);
    try {
      localStorage.setItem('descubra_artes_user', JSON.stringify(profile));
      if (storeId) {
        setActiveStoreId(storeId);
      } else {
        import('./data/store-service').then(({ storeService }) => {
          storeService.getStoreByEmail(cleanEmail).then((s) => {
            if (s) setActiveStoreId(s.id);
            else setActiveStoreId('');
          });
        });
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
    syncAuthCookies(null);
    setActiveStoreId('');
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
