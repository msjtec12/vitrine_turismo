import React from 'react';
import { Sparkles, CheckCircle2, Zap, Star } from 'lucide-react';
import { mockPlans } from '@/lib/data/mock-data';

export default function PainelDestaquesPage() {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C85A32]">
          <Sparkles size={14} />
          <span>Monetização & Planos de Exposição</span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B4332]">
          Destaques & Planos do Ateliê
        </h1>
        <p className="text-xs text-[#7F4F24]">
          Seu ateliê está atualmente com o plano <strong>PREMIUM ATIVO</strong> (Selo Verificado e Destaque na Home de São Roque).
        </p>
      </div>

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockPlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white p-6 rounded-3xl border flex flex-col justify-between ${
              plan.id === 'plan-premium'
                ? 'border-[#C85A32] ring-2 ring-[#C85A32]/20 shadow-lg'
                : 'border-[#EDE5D8] shadow-xs'
            }`}
          >
            <div className="space-y-3">
              {plan.id === 'plan-premium' && (
                <span className="inline-block bg-[#D8F3DC] text-[#1B4332] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  ✓ Seu Plano Atual
                </span>
              )}
              <h3 className="font-serif font-bold text-xl text-[#1B4332]">
                {plan.name}
              </h3>
              <div className="text-3xl font-extrabold font-serif text-[#2C2623]">
                {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2).replace('.', ',')}`}
                <span className="text-xs font-sans text-[#7F4F24] font-normal ml-1">
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-2 text-xs text-[#4A3525] pt-3 border-t border-[#EDE5D8]">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 size={14} className="text-[#2D6A4F] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 mt-4 border-t border-[#EDE5D8]">
              <button
                disabled={plan.id === 'plan-premium'}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  plan.id === 'plan-premium'
                    ? 'bg-[#EDE5D8] text-[#7F4F24] cursor-default'
                    : 'bg-[#1B4332] text-white hover:bg-[#2D6A4F]'
                }`}
              >
                {plan.id === 'plan-premium' ? 'Plano Atual' : 'Contratar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
