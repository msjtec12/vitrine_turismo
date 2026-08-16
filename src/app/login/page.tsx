'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, User, Shield, Store } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

import Logo from '@/components/ui/Logo';

export default function LoginPage() {
  const router = useRouter();
  const { loginAs, loginWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    loginWithEmail(email, 'ARTISAN');
    router.push('/painel');
  };

  const handleFastLogin = (role: 'ARTISAN' | 'ADMIN' | 'CUSTOMER') => {
    loginAs(role);
    if (role === 'ARTISAN') router.push('/painel');
    else if (role === 'ADMIN') router.push('/admin');
    else router.push('/');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#EDE5D8] shadow-artisan space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <Logo variant="icon-only" size="xl" href="/" />
          <h1 className="font-serif font-bold text-2xl text-[#1B4332]">
            Entrar no Descubra Artes
          </h1>
          <p className="text-xs text-[#7F4F24]">
            Acesse seu ateliê, cadastre produtos e veja suas conversões
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] space-y-2.5">
          <div className="text-[11px] font-bold text-[#7F4F24] uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={12} className="text-[#C85A32]" />
            Acesso Rápido para Avaliação (Demo):
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleFastLogin('ARTISAN')}
              className="px-3 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#2D6A4F] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Store size={14} />
              <span>Como Artesão</span>
            </button>
            <button
              onClick={() => handleFastLogin('ADMIN')}
              className="px-3 py-2 rounded-xl bg-[#7F4F24] text-white text-xs font-semibold hover:bg-[#582F0E] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Shield size={14} />
              <span>Como Admin</span>
            </button>
          </div>
        </div>

        {/* Traditional Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#C85A32] hover:bg-[#A4421F] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Entrar na Minha Conta</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="text-center text-xs text-[#7F4F24] pt-2 border-t border-[#EDE5D8]">
          Não tem uma conta ainda?{' '}
          <Link href="/cadastro" className="font-bold text-[#1B4332] hover:text-[#C85A32]">
            Cadastre seu ateliê grátis
          </Link>
        </div>
      </div>
    </div>
  );
}
