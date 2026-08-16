'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

import Logo from '@/components/ui/Logo';

export default function CadastroPage() {
  const router = useRouter();
  const { loginWithEmail } = useAuth();
  const [storeName, setStoreName] = useState('');
  const [artisanName, setArtisanName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('sao-roque');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    loginWithEmail(email, 'ARTISAN');
    router.push('/painel/loja');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-[#EDE5D8] shadow-artisan space-y-6">
        <div className="text-center space-y-2 flex flex-col items-center">
          <Logo variant="icon-only" size="xl" href="/" />
          <h1 className="font-serif font-bold text-2xl text-[#1B4332]">
            Cadastre Seu Ateliê no Descubra Artes
          </h1>
          <p className="text-xs text-[#7F4F24]">
            Conecte sua produção aos turistas de São Roque e receba clientes no WhatsApp
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
                Nome da Loja / Ateliê *
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Ex.: Ateliê Terra & Vinho"
                className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] outline-hidden font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
                Seu Nome (Artesão) *
              </label>
              <input
                type="text"
                required
                value={artisanName}
                onChange={(e) => setArtisanName(e.target.value)}
                placeholder="Ex.: Maria de Souza"
                className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] outline-hidden font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
                E-mail para Acesso *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="artesao@email.com"
                className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
                WhatsApp Comercial *
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7F4F24] mb-1.5">
              Cidade do Ateliê *
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#EDE5D8] text-sm text-[#2C2623] focus:border-[#C85A32] outline-hidden font-medium"
            >
              <option value="sao-roque">São Roque - SP (Foco MVP)</option>
              <option value="embu-das-artes">Embu das Artes - SP</option>
              <option value="holambra">Holambra - SP</option>
              <option value="paraty">Paraty - RJ</option>
            </select>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE5D8] text-[11px] text-[#7F4F24] flex items-center gap-2">
            <CheckCircle2 size={15} className="text-[#2D6A4F] shrink-0" />
            <span>Cadastro 100% gratuito. Sem comissão sobre suas vendas.</span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Criar Minha Loja & Acessar Painel</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="text-center text-xs text-[#7F4F24] pt-2 border-t border-[#EDE5D8]">
          Já possui cadastro?{' '}
          <Link href="/login" className="font-bold text-[#C85A32] hover:text-[#A4421F]">
            Entrar na sua conta
          </Link>
        </div>
      </div>
    </div>
  );
}
