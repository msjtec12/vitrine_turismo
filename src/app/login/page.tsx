'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Logo from '@/components/ui/Logo';
import { sanitizeEmail } from '@/lib/security/sanitize';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '';
  const errorParam = searchParams.get('error') || '';

  const { loginWithCredentials, setActiveStoreId } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Read lockout from sessionStorage
  useEffect(() => {
    try {
      const storedLock = sessionStorage.getItem('descubra_login_lockout');
      if (storedLock) {
        const time = parseInt(storedLock, 10);
        if (time > Date.now()) {
          setLockoutUntil(time);
        }
      }
    } catch {}

    if (errorParam === 'unauthorized_admin') {
      setError('Acesso negado: faça login com uma conta de Administrador para acessar o Painel Master.');
    }
  }, [errorParam]);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutUntil) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutSeconds(remaining);
      if (remaining <= 0) {
        setLockoutUntil(null);
        setFailedAttempts(0);
        try {
          sessionStorage.removeItem('descubra_login_lockout');
        } catch {}
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutUntil && lockoutUntil > Date.now()) {
      setError(`Muitas tentativas incorretas. Aguarde ${lockoutSeconds}s antes de tentar novamente.`);
      return;
    }

    setError('');
    const cleanEmail = sanitizeEmail(email);

    if (!cleanEmail || !password) {
      setError('Por favor, informe seu e-mail e senha.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginWithCredentials(cleanEmail, password);
      const { storeService } = await import('@/lib/data/store-service');
      const userStore = await storeService.getStoreByEmail(cleanEmail);
      if (userStore) {
        setActiveStoreId(userStore.id);
      }

      setFailedAttempts(0);

      // Redirect properly based on role or requested path
      if (redirectPath) {
        if (redirectPath.startsWith('/admin') && res.role !== 'ADMIN') {
          setError('Sua conta não possui privilégios de Administrador.');
          router.push('/painel');
          return;
        }
        router.push(redirectPath);
      } else if (res.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/painel');
      }
    } catch (err: any) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5) {
        const lockTime = Date.now() + 30000; // 30s lockout
        setLockoutUntil(lockTime);
        setLockoutSeconds(30);
        try {
          sessionStorage.setItem('descubra_login_lockout', lockTime.toString());
        } catch {}
        setError('Muitas tentativas incorretas. Acesso temporariamente bloqueado por 30 segundos por segurança.');
      } else {
        setError(err.message || 'E-mail ou senha incorretos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isLocked = Boolean(lockoutUntil && lockoutUntil > Date.now());

  return (
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
          {errorParam === 'unauthorized_admin' ? (
            <ShieldAlert size={16} className="shrink-0 text-red-600" />
          ) : (
            <AlertCircle size={15} className="shrink-0" />
          )}
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
              disabled={isLocked}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] outline-hidden bg-[#FAF7F2] disabled:opacity-60"
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
            disabled={isLocked}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] outline-hidden bg-[#FAF7F2] disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={loading || isLocked}
          className="w-full py-4 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <span>Entrando com segurança...</span>
          ) : isLocked ? (
            <span>Bloqueado temporariamente ({lockoutSeconds}s)</span>
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
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="w-10 h-10 border-3 border-[#1B4332] border-t-transparent rounded-full animate-spin" />}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
