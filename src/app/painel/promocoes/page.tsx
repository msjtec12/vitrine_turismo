'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Plus, Sparkles, CheckCircle2, Package, Lock, ArrowRight, MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { storeService } from '@/lib/data/store-service';
import { Product, Store } from '@/types';
import { getStoreEffectiveEntitlements } from '@/lib/plans/entitlements';
import Link from 'next/link';

export default function PainelPromocoesPage() {
  const { activeStoreId, user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      let targetStoreId = activeStoreId;
      if (!targetStoreId && user?.email) {
        const s = await storeService.getStoreByEmail(user.email);
        if (s) targetStoreId = s.id;
      }
      if (targetStoreId) {
        const [loadedStore, prods] = await Promise.all([
          storeService.getStoreById(targetStoreId),
          storeService.getProductsByStoreId(targetStoreId),
        ]);
        if (loadedStore) setStore(loadedStore);
        setProducts(prods);
      } else {
        setStore(null);
        setProducts([]);
      }
      setLoading(false);
    }
    loadData();
  }, [activeStoreId, user]);

  const entitlements = getStoreEffectiveEntitlements(store, products.length);
  const promoProducts = products.filter((p: Product) => p.isPromo);

  const whatsappUpgradeUrl = `https://wa.me/5516991551200?text=${encodeURIComponent(
    `Olá! Gostaria de fazer o upgrade para o Plano Profissional (R$ 49,90/mês) no Descubra Artes para liberar as Ofertas Locais no ateliê "${store?.name || 'meu ateliê'}".`
  )}`;

  if (!loading && !entitlements.canCreateOffers) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs">
          <h1 className="font-serif font-bold text-2xl text-[#1B4332] flex items-center gap-2">
            <Flame size={22} className="text-[#C85A32]" />
            <span>Gestão de Promoções & Ofertas Locais</span>
          </h1>
          <p className="text-xs text-[#7F4F24] mt-1">
            Divulgação destacada de descontos para turistas em São Roque e região
          </p>
        </div>

        {/* Locked Feature Educational Banner */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EDE5D8] shadow-xs text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-[#FEF9EF] text-[#C85A32] flex items-center justify-center mx-auto border border-[#EDE5D8]">
            <Lock size={32} />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C85A32] bg-[#FDE8E1] px-3 py-1 rounded-full">
              Recurso Exclusivo
            </span>
            <h2 className="font-serif font-bold text-2xl text-[#1B4332]">
              Ofertas Locais é um recurso do Plano Profissional
            </h2>
            <p className="text-xs text-[#7F4F24] leading-relaxed max-w-lg mx-auto">
              Com o <strong>Plano Profissional (R$ 49,90/mês)</strong>, você publica descontos sazonais na vitrine regional, ganha exposição prioritária nas buscas e atrai turistas que procuram lembranças e presentes artesanais.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D8] text-left space-y-3 text-xs max-w-md mx-auto">
            <span className="font-bold text-[#1B4332] block">Vantagens do Plano Profissional:</span>
            <ul className="space-y-2 text-[11px] text-[#7F4F24]">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#2D6A4F] shrink-0" />
                <span>Publicação ilimitada na área de <strong>Ofertas Locais</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#2D6A4F] shrink-0" />
                <span><strong>Catálogo ilimitado</strong> de peças e produtos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#2D6A4F] shrink-0" />
                <span><strong>Selo Oficial</strong> de Produtor Verificado</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#2D6A4F] shrink-0" />
                <span>Estatísticas avançadas de cliques e visitas</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <a
              href={whatsappUpgradeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs rounded-2xl shadow-md transition-all"
            >
              <MessageCircle size={16} className="text-[#E9C46A]" />
              <span>Fazer Upgrade via WhatsApp (R$ 49,90/mês)</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#EDE5D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1B4332] flex items-center gap-2">
            <Flame size={22} className="text-[#C85A32]" />
            <span>Gestão de Promoções & Ofertas</span>
          </h1>
          <p className="text-xs text-[#7F4F24] mt-1">
            Crie descontos para atrair turistas em feriados, festivais de inverno e datas comemorativas
          </p>
        </div>

        <Link
          href="/painel/produtos"
          className="px-5 py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#A4421F] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
        >
          <span>Ativar Oferta em Produto</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-[#EDE5D8]" />
          ))}
        </div>
      ) : promoProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#EDE5D8] text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FAF7F2] text-[#7F4F24] flex items-center justify-center mx-auto">
            <Flame size={28} className="text-[#C85A32]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-[#1B4332]">
              Nenhuma promoção ativa no momento
            </h3>
            <p className="text-xs text-[#7F4F24] max-w-md mx-auto">
              Você pode aplicar descontos em produtos específicos diretamente na aba de produtos para que eles apareçam na página de ofertas.
            </p>
          </div>
          <Link
            href="/painel/produtos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B4332] text-white text-xs font-bold rounded-xl hover:bg-[#2D6A4F] transition-colors"
          >
            <Package size={16} />
            <span>Gerenciar Produtos</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {promoProducts.map((p: Product) => (
            <div
              key={p.id}
              className="bg-white p-5 rounded-2xl border border-[#EDE5D8] shadow-xs space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.coverImage}
                  alt={p.name}
                  className="w-14 h-14 rounded-xl object-cover border border-[#EDE5D8]"
                />
                <div className="min-w-0">
                  <h3 className="font-serif font-bold text-sm text-[#1B4332] truncate">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-[#C85A32] text-sm">
                      R$ {p.promoPrice?.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs text-[#9E9188] line-through">
                      R$ {p.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-[#FAF7F2] rounded-xl text-[11px] text-[#7F4F24] flex items-center justify-between">
                <span>Desconto ativo:</span>
                <span className="font-bold text-[#C85A32]">
                  {p.promoPrice ? `-${Math.round((1 - p.promoPrice / p.price) * 100)}% OFF` : 'Em oferta'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
