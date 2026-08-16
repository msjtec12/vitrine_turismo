'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Logo from '@/components/ui/Logo';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCredentials } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, informe seu e-mail e senha.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginWithCredentials(email, password);
      if (res.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/painel');
      }
    } catch (err: any) {
      setError(err.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#EDE5D8] shadow-artisan space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <Logo variant="icon-only" size="xl" href="/" />
          <h1 className="font-serif font-extrabold text-2xl text-[#1B4332]">
            Acessar Minha Conta
          </h1>
          <p className="text-xs text-[#7F4F24]">
            Entre com seus dados para gerenciar seu ateliê e vitrine digital
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#FDE8E1] border border-[#C85A32]/30 text-[#C85A32] text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3525] mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A3525]">
                Senha
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] outline-hidden bg-[#FAF7F2]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span>Entrando...</span>
            ) : (
              <>
                <span>Entrar no Painel</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#7F4F24] pt-4 border-t border-[#EDE5D8] space-y-2">
          <p>
            É artesão e ainda não tem vitrine?{' '}
            <Link
              href="/quero-vender/cadastro"
              className="font-bold text-[#C85A32] hover:underline block mt-1"
            >
              Criar minha loja gratuitamente
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
