'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Store,
  Package,
  MapPin,
  Sparkles,
  Users,
  BarChart3,
  ExternalLink,
  PlusCircle,
  Clock,
  Layers,
} from 'lucide-react';

import AdminAuthGuard from '@/components/admin/AdminAuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navTabs = [
    { label: 'Visão Geral', href: '/admin', icon: <BarChart3 size={15} /> },
    { label: 'Artesãos & Lojas', href: '/admin/artesaos', icon: <Users size={15} /> },
    { label: '+ Cadastrar Artesão', href: '/admin/artesaos/novo', icon: <PlusCircle size={15} /> },
    { label: 'Moderação de Produtos', href: '/admin/produtos', icon: <Package size={15} /> },
    { label: 'Destaques & Planos', href: '/admin/destaques', icon: <Sparkles size={15} /> },
  ];

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#FAF7F2]">
        {/* Top Admin Bar */}
        <div className="bg-[#1B4332] text-white py-3.5 px-4 sm:px-8 border-b border-[#2D6A4F]/40 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E9C46A] text-[#1B4332] flex items-center justify-center font-bold">
                <ShieldCheck size={18} />
              </div>
              <div>
                <span className="font-serif font-bold text-base text-white block leading-tight">
                  Painel Master de Administração & Curadoria
                </span>
                <span className="text-[10px] text-[#E9C46A] uppercase tracking-wider font-semibold">
                  São Roque & Cidades Integradas
                </span>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors w-fit border border-white/15"
            >
              <span>Ver Portal Público</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="bg-white border-b border-[#EDE5D8] sticky top-0 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
              {navTabs.map((tab) => {
                const active = tab.href === '/admin' ? pathname === '/admin' : pathname.startsWith(tab.href);
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      active
                        ? 'bg-[#1B4332] text-white shadow-xs'
                        : 'text-[#4A3525] hover:bg-[#FAF7F2] hover:text-[#C85A32]'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {children}
        </div>
      </div>
    </AdminAuthGuard>
  );
}
