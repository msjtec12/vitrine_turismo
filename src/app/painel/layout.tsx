'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Store as StoreIcon,
  Package,
  Flame,
  Sparkles,
  BarChart3,
  Settings,
  ExternalLink,
  Clock,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { storeService } from '@/lib/data/store-service';
import { Store } from '@/types';

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, activeStoreId } = useAuth();
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    async function loadStore() {
      if (activeStoreId) {
        const s = await storeService.getStoreById(activeStoreId);
        if (s) {
          setStore(s);
          return;
        }
      }
      if (user?.email) {
        const s = await storeService.getStoreByEmail(user.email);
        if (s) {
          setStore(s);
          return;
        }
      }
      // If user has no store, do NOT fallback to seed stores!
      setStore(null);
    }

    loadStore();
  }, [activeStoreId, user]);

  const navItems = [
    { label: 'Dashboard', href: '/painel', icon: <LayoutDashboard size={18} /> },
    { label: 'Minha Loja', href: '/painel/loja', icon: <StoreIcon size={18} /> },
    { label: 'Produtos', href: '/painel/produtos', icon: <Package size={18} /> },
    { label: 'Promoções', href: '/painel/promocoes', icon: <Flame size={18} /> },
    { label: 'Destaques & Planos', href: '/painel/destaques', icon: <Sparkles size={18} /> },
    { label: 'Estatísticas', href: '/painel/estatisticas', icon: <BarChart3 size={18} /> },
    { label: 'Configurações', href: '/painel/configuracoes', icon: <Settings size={18} /> },
  ];

  const storeName = store?.name || (user?.fullName ? `Ateliê de ${user.fullName.split(' ')[0]}` : 'Meu Ateliê');
  const isApproved = store?.status === 'APPROVED';

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Top Banner inside Painel */}
      <div className="bg-[#1B4332] text-white py-3 px-4 sm:px-8 border-b border-[#2D6A4F]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-base text-[#E9C46A]">
              Painel do Artesão
            </span>
            <span className="text-white/40">•</span>
            <span className="text-xs text-white/90 font-medium truncate max-w-[200px] sm:max-w-xs">
              {storeName}
            </span>
            {store && store.status === 'PENDING' && (
              <span className="text-[10px] bg-[#E9C46A] text-[#1B4332] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock size={10} />
                <span>Em Análise</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs">
            {store && isApproved && store.slug ? (
              <Link
                href={`/loja/${store.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg transition-colors font-medium cursor-pointer"
              >
                <span>Ver Minha Loja Pública</span>
                <ExternalLink size={12} />
              </Link>
            ) : store ? (
              <Link
                href="/painel/loja"
                className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white/90 px-3 py-1 rounded-lg transition-colors text-[11px]"
              >
                <span>Editar Dados do Ateliê</span>
              </Link>
            ) : (
              <Link
                href="/quero-vender/cadastro"
                className="inline-flex items-center gap-1.5 bg-[#C85A32] hover:bg-[#A4421F] text-white px-3.5 py-1.5 rounded-lg transition-colors text-xs font-bold shadow-xs"
              >
                <PlusCircle size={13} />
                <span>Criar Minha Loja</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Artisan Sidebar Navigation */}
        <aside className="w-full md:w-60 shrink-0 space-y-2">
          <div className="bg-white p-3 rounded-2xl border border-[#EDE5D8] shadow-xs space-y-1">
            {navItems.map((item) => {
              const active = item.href === '/painel' ? pathname === '/painel' : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'text-[#4A3525] hover:bg-[#FAF7F2] hover:text-[#C85A32]'
                  }`}
                >
                  <span className={active ? 'text-[#E9C46A]' : 'text-[#7F4F24]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick Support Badge */}
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EDE5D8] text-xs text-[#7F4F24] space-y-1">
            <div className="font-bold text-[#1B4332]">Dúvidas ou Suporte?</div>
            <p className="text-[11px] text-[#6B625B]">
              Fale com o time de curadoria pelo WhatsApp de São Roque.
            </p>
          </div>
        </aside>

        {/* Main Artisan Page Workspace */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
