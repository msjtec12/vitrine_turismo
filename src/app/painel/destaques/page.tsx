'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Zap, Star } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { storeService } from '@/lib/data/store-service';
import { mockPlans } from '@/lib/data/mock-data';
import { Store } from '@/types';

export default function PainelDestaquesPage() {
  const { activeStoreId, user } = useAuth();
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
    }
    loadStore();
  }, [activeStoreId, user]);

  const currentPlan = store?.planType || 'FREE';

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C85A32]">
          <Sparkles size={14} />
          <span>Visibilidade & Planos de Exposição</span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B4332]">
          Destaques & Planos do Ateliê
        </h1>
        <p className="text-xs text-[#7F4F24]">
          {currentPlan === 'PRO' || currentPlan === 'PREMIUM'
            ? `Seu ateliê está atualmente com o plano ${currentPlan} ativo com selo e destaque na vitrine de São Roque.`
            : 'Seu ateliê está no Plano Básico Gratuito. Aumente o alcance com destaques e selo de verificação.'}
        </p>
      </div>

      {/* Plans Comparison */}
      <div className="max-w-xl mx-auto">
        {mockPlans.map((plan) => {
          const isThisPlan = (plan.id === 'plan-pro' && (currentPlan === 'PRO' || currentPlan === 'PREMIUM'));

          return (
            <div
              key={plan.id}
              className={`bg-white p-6 sm:p-8 rounded-3xl border flex flex-col justify-between ${
                isThisPlan
                  ? 'border-[#2D6A4F] ring-2 ring-[#2D6A4F]/20 shadow-lg'
                  : 'border-[#C85A32] ring-2 ring-[#C85A32]/20 shadow-md'
              }`}
            >
              <div className="space-y-3">
                {isThisPlan ? (
                  <span className="inline-block bg-[#D8F3DC] text-[#1B4332] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    ✓ Seu Plano Atual Ativo
                  </span>
                ) : (
                  <span className="inline-block bg-[#C85A32] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    ⭐ Vitrine Completa
                  </span>
                )}
                <h3 className="font-serif font-bold text-2xl text-[#1B4332]">
                  {plan.name}
                </h3>
                <div className="text-3xl font-extrabold font-serif text-[#2C2623]">
                  R$ {plan.price.toFixed(2).replace('.', ',')}
                  <span className="text-xs font-sans text-[#7F4F24] font-normal ml-1">
                    {plan.period}
                  </span>
                </div>
                <p className="text-xs text-[#7F4F24]">
                  {plan.description}
                </p>
                <ul className="space-y-2.5 text-xs text-[#4A3525] pt-3 border-t border-[#EDE5D8]">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={15} className="text-[#2D6A4F] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-4 border-t border-[#EDE5D8] space-y-2">
                <a
                  href={`https://wa.me/5516991551200?text=${encodeURIComponent(`Olá! Sou do ateliê "${store?.name || 'Meu Ateliê'}" e gostaria de ativar/renovar meu plano no Descubra Artes (R$ 49,90/mês).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5B] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Sparkles size={14} />
                  <span>Falar com o Suporte no WhatsApp (16) 99155-1200</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
