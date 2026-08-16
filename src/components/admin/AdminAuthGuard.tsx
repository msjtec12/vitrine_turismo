'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Lock, ArrowRight, Home } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const { user, isLoggedIn, isAdmin } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 border-3 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
            Validando Acesso de Segurança...
          </span>
        </div>
      </div>
    );
  }

  // Check if authorized admin
  const hasAdminAccess = isLoggedIn && isAdmin;

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#EDE5D8] shadow-artisan text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mx-auto border border-red-200">
            <ShieldAlert size={32} />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-100/60 px-3 py-1 rounded-full">
              Área Restrita • Acesso Negado
            </span>
            <h1 className="font-serif font-bold text-2xl text-[#1B4332] mt-2">
              Painel Administrativo Master
            </h1>
            <p className="text-xs text-[#7F4F24] leading-relaxed">
              Esta seção é restrita aos administradores e curadores oficiais do Descubra Artes. Você precisa estar autenticado com uma conta autorizada para prosseguir.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] text-xs text-left space-y-1.5 text-[#4A3525]">
            <div className="flex items-center gap-1.5 font-bold text-[#1B4332]">
              <Lock size={13} />
              <span>Controle de Segurança Ativo</span>
            </div>
            <p className="text-[11px] text-[#6B625B]">
              Tentativas de acesso não autorizadas são monitoradas e registradas por segurança.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/login?redirect=/admin"
              className="flex-1 py-3 px-4 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <span>Fazer Login Master</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/"
              className="py-3 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE5D8] text-[#1B4332] text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-[#EDE5D8]"
            >
              <Home size={14} />
              <span>Ir ao Início</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
