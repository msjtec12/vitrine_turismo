'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Zap, Star, ShieldCheck, Clock, Calendar, ArrowRight, MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { storeService } from '@/lib/data/store-service';
import { Store, Product } from '@/types';
import { getStoreEffectiveEntitlements, getPlanDisplayName, getAccountStatusBadge } from '@/lib/plans/entitlements';

export default function PainelDestaquesPage() {
  const { activeStoreId, user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      let targetId = activeStoreId;
      if (!targetId && user?.email) {
        const s = await storeService.getStoreByEmail(user.email);
        if (s) targetId = s.id;
      }
      if (targetId) {
        const [loadedStore, prods] = await Promise.all([
          storeService.getStoreById(targetId),
          storeService.getProductsByStoreId(targetId),
        ]);
        if (loadedStore) setStore(loadedStore);
        setProducts(prods);
      }
      setLoading(false);
    }
    loadData();
  }, [activeStoreId, user]);

  const entitlements = getStoreEffectiveEntitlements(store, products.length);
  const isPro = entitlements.effectivePlan === 'PROFESSIONAL' || entitlements.effectivePlan === 'PRO' || entitlements.effectivePlan === 'PREMIUM';
  const statusBadge = getAccountStatusBadge(store?.accountStatus);

  const whatsappUrl = `https://wa.me/5516991551200?text=${encodeURIComponent(
    `Olá! Gostaria de falar sobre os planos e destaques do Descubra Artes para o ateliê "${store?.name || 'meu ateliê'}".`
  )}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C85A32]">
          <Sparkles size={14} />
          <span>Visibilidade & Planos de Exposição</span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B4332]">
          Plano Atual & Destaques
        </h1>
        <p className="text-xs text-[#7F4F24]">
          Gerencie os recursos da sua conta e consulte os benefícios de visibilidade para atrair turistas em São Roque.
        </p>
      </div>

      {/* Current Plan Overview Card */}
      {store && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE5D8] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl text-[#1B4332]">
                  {getPlanDisplayName(store.planType)}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.color}`}>
                  Conta {statusBadge.label}
                </span>
              </div>
              <p className="text-xs text-[#7F4F24] mt-1">
                Ateliê {store.name} • {store.city?.name || 'São Roque'}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-[#7F4F24] block">Vigência do Plano</span>
              <span className="text-xs font-bold text-[#1B4332] flex items-center sm:justify-end gap-1 mt-0.5">
                <Calendar size={13} className="text-[#C85A32]" />
                {store.planExpiresAt ? (
                  <>Válido até {new Date(store.planExpiresAt).toLocaleDateString('pt-BR')}</>
                ) : (
                  <>Sem data de expiração (Ativo)</>
                )}
              </span>
            </div>
          </div>

          {/* Entitlements Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#7F4F24]">Limite de Peças</span>
              <div className="font-serif font-bold text-lg text-[#1B4332]">
                {products.length} / {entitlements.maxProducts !== null ? entitlements.maxProducts : '∞ Ilimitado'}
              </div>
              <span className="text-[10px] text-[#7F4F24]">
                {entitlements.canAddProduct ? '✓ Cadastro liberado' : '🔒 Limite atingido'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#7F4F24]">Ofertas Locais</span>
              <div className="font-serif font-bold text-lg text-[#1B4332]">
                {entitlements.canCreateOffers ? 'Liberado' : 'Bloqueado'}
              </div>
              <span className="text-[10px] text-[#7F4F24]">
                {entitlements.canCreateOffers ? '✓ Promoções ativas' : '🔒 Exclusivo Plano Pro'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#7F4F24]">Selo Verificado</span>
              <div className="font-serif font-bold text-lg text-[#1B4332]">
                {store.verified ? 'Verificado ✓' : 'Não verificado'}
              </div>
              <span className="text-[10px] text-[#7F4F24]">
                {store.verified ? '✓ Selo oficial ativo' : 'Aguardando curadoria'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#7F4F24]">Vitrine em Destaque</span>
              <div className="font-serif font-bold text-lg text-[#1B4332]">
                {store.isFeatured ? 'Em Destaque ⭐' : 'Padrão'}
              </div>
              <span className="text-[10px] text-[#7F4F24]">
                {store.isFeatured ? '✓ Exposição no topo' : 'Posição normal'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Plan Card (Upgrade or Current Pro) */}
      <div className="max-w-xl mx-auto">
        <div
          className={`bg-white p-6 sm:p-8 rounded-3xl border flex flex-col justify-between ${
            isPro
              ? 'border-[#2D6A4F] ring-2 ring-[#2D6A4F]/20 shadow-md'
              : 'border-[#C85A32] ring-2 ring-[#C85A32]/20 shadow-lg'
          }`}
        >
          <div className="space-y-4">
            {isPro ? (
              <span className="inline-block bg-[#D8F3DC] text-[#1B4332] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                ✓ Seu Plano Profissional Ativo
              </span>
            ) : (
              <span className="inline-block bg-[#C85A32] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                ⭐ Conheça o Plano Profissional
              </span>
            )}

            <div>
              <h3 className="font-serif font-bold text-2xl text-[#1B4332]">
                Plano Profissional
              </h3>
              <p className="text-xs text-[#7F4F24] mt-1">
                A ferramenta completa para ateliês, artesãos e produtores que desejam vender mais.
              </p>
            </div>

            <div className="text-3xl font-extrabold font-serif text-[#2C2623]">
              R$ 49,90
              <span className="text-xs font-sans text-[#7F4F24] font-normal ml-1">
                / mês
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#4A3525] pt-3 border-t border-[#EDE5D8]">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-[#2D6A4F] shrink-0 mt-0.5" />
                <span><strong>Produtos e peças ilimitadas</strong> no catálogo</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-[#2D6A4F] shrink-0 mt-0.5" />
                <span>Mais fotos por peça e galeria expandida de processos</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-[#2D6A4F] shrink-0 mt-0.5" />
                <span>Publicação direta na área de <strong>Ofertas Locais</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-[#2D6A4F] shrink-0 mt-0.5" />
                <span><strong>Selo Oficial de Produtor Verificado</strong> na vitrine</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-[#2D6A4F] shrink-0 mt-0.5" />
                <span>Estatísticas completas de visualizações e cliques de turistas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-[#2D6A4F] shrink-0 mt-0.5" />
                <span>Maior exposição na vitrine turística regional</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-4 border-t border-[#EDE5D8]">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle size={15} className="text-[#E9C46A]" />
              <span>Falar com o Administrador no WhatsApp (16) 99155-1200</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
