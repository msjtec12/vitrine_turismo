'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Store as StoreIcon,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  Clock,
  Package,
} from 'lucide-react';
import { storeService } from '@/lib/data/store-service';
import { useAuth } from '@/lib/auth-context';
import { Artisan, Store } from '@/types';
import Logo from '@/components/ui/Logo';

interface ConviteClientProps {
  artisan: Artisan;
  store: Store;
  token: string;
}

export default function ConviteClient({ artisan, store, token }: ConviteClientProps) {
  const router = useRouter();
  const { loginWithEmail } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await storeService.acceptInvitation(token, password);
      // Auto-authenticate as artisan
      loginWithEmail(artisan.email, 'ARTISAN');
      router.push('/painel?welcome=true');
    } catch (err: any) {
      setError(err.message || 'Erro ao ativar convite. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 border border-[#EDE5D8] shadow-artisan space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <Logo variant="icon-only" size="xl" href="/" />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8F3DC] text-[#1B4332] text-xs font-bold uppercase tracking-wider mt-2">
            <Sparkles size={13} className="text-[#C85A32]" />
            <span>Convite Oficial de Curadoria</span>
          </div>

          <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#1B4332]">
            Sua loja está pronta!
          </h1>
          <p className="text-xs text-[#7F4F24] max-w-sm">
            Você foi convidado para administrar sua vitrine digital no <strong>Descubra Artes</strong>.
          </p>
        </div>

        {/* Store Preview Card */}
        <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shrink-0 font-bold font-serif text-lg">
              {store.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-serif font-bold text-base text-[#1B4332] truncate">
                {store.name}
              </h3>
              <p className="text-xs text-[#7F4F24] truncate">
                {artisan.fullName} • {store.city?.name || 'São Roque'} - SP
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#6B625B] pt-2 border-t border-[#EDE5D8]">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-[#2D6A4F]" />
              <span>Verificado pela Curadoria</span>
            </span>
            <span className="font-semibold text-[#C85A32]">
              {store.productsCount || 0} produtos pré-carregados
            </span>
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handleAcceptInvite} className="space-y-4">
          <div className="border-b border-[#EDE5D8] pb-3">
            <h3 className="font-serif font-bold text-base text-[#1B4332]">
              Defina sua Senha de Acesso
            </h3>
            <p className="text-[11px] text-[#7F4F24]">
              Por segurança, somente você terá acesso à sua conta e senha.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-[#FDE8E1] border border-[#C85A32]/30 text-[#C85A32] text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
              E-mail de Login
            </label>
            <input
              type="email"
              value={artisan.email}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] bg-[#FAF7F2] text-[#7F6A5D] text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
              Criar Senha * (mínimo 6 dígitos)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha segura"
              required
              className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
              Confirmar Senha *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita sua senha"
              required
              className="w-full px-4 py-3 rounded-xl border border-[#EDE5D8] focus:border-[#C85A32] outline-hidden text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Ativando conta...</span>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Criar Minha Senha e Acessar Painel</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
