'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, MapPin, Heart, User, Store } from 'lucide-react';
import { useFavorites } from '@/lib/favorites-context';
import { useAuth } from '@/lib/auth-context';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { favoritesCount } = useFavorites();
  const { role } = useAuth();

  const navItems = [
    {
      label: 'Início',
      href: '/',
      icon: (active: boolean) => <Home size={19} strokeWidth={active ? 2.2 : 1.8} className={active ? 'fill-[#C85A32]/15' : ''} />,
    },
    {
      label: 'Explorar',
      href: '/explorar',
      icon: (active: boolean) => <Compass size={19} strokeWidth={active ? 2.2 : 1.8} />,
    },
    {
      label: 'Mapa',
      href: '/mapa',
      icon: (active: boolean) => <MapPin size={19} strokeWidth={active ? 2.2 : 1.8} className={active ? 'fill-[#C85A32]/15' : ''} />,
    },
    {
      label: 'Favoritos',
      href: '/favoritos',
      icon: (active: boolean) => <Heart size={19} strokeWidth={active ? 2.2 : 1.8} className={active ? 'fill-[#C85A32]' : ''} />,
      badge: favoritesCount,
    },
    {
      label: role === 'ADMIN' ? 'Admin' : 'Painel',
      href: role === 'ADMIN' ? '/admin' : '/painel',
      icon: (active: boolean) =>
        role === 'ADMIN' ? (
          <User size={19} strokeWidth={active ? 2.2 : 1.8} />
        ) : (
          <Store size={19} strokeWidth={active ? 2.2 : 1.8} />
        ),
    },
  ];

  return (
    <nav
      aria-label="Navegação inferior móvel"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EDE5D8] md:hidden shadow-lg"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active ? 'text-[#C85A32] font-semibold' : 'text-[#7F6A5D] hover:text-[#2C2623]'
              }`}
            >
              <div className="relative">
                {item.icon(active)}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-[#C85A32] text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              {active && (
                <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#C85A32]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
